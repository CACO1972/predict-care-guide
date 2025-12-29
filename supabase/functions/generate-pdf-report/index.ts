import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IRPData {
  score: number;
  riskLevel: string;
  interpretation: string;
  advice: string;
  gumBleeding?: string;
  looseTeethLoss?: string;
  oralHygiene?: string;
}

interface ReportData {
  id: string;
  date: string;
  patientName?: string;
  pronosticoLabel: string;
  pronosticoMessage: string;
  successRange: string;
  factors: Array<{ name: string; value: string; impact: number }>;
  recommendations: Array<{ text: string; evidence: string }>;
  synergies?: string[];
  methodology?: string;
  reportLevel?: 'free' | 'basic' | 'premium';
  irpData?: IRPData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reportData: ReportData = await req.json();
    const reportLevel = reportData.reportLevel || 'free';
    console.log(`Generating ${reportLevel} PDF for report:`, reportData.id);

    const htmlContent = generateReportHTML(reportData, reportLevel);
    
    const levelSuffix = reportLevel === 'free' ? 'IRP' : reportLevel === 'basic' ? 'Plan' : 'Premium';
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        html: htmlContent,
        downloadName: `ImplantX_${levelSuffix}_${reportData.patientName?.replace(/\s/g, '_') || 'Paciente'}_${reportData.id}.html`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error generating PDF:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReportHTML(data: ReportData, level: 'free' | 'basic' | 'premium'): string {
  const irpData = data.irpData;
  
  // Generar sección IRP (presente en todos los niveles)
  const irpSectionHTML = irpData ? `
    <div class="section irp-section">
      <h3>Tu Índice de Riesgo Periodontal (IRP)</h3>
      <div class="irp-score-container">
        <div class="irp-circle ${irpData.score <= 40 ? 'high-risk' : irpData.score <= 70 ? 'medium-risk' : 'low-risk'}">
          <span class="score-value">${irpData.score}</span>
          <span class="score-label">/100</span>
        </div>
        <div class="irp-badge ${irpData.score <= 40 ? 'high-risk' : irpData.score <= 70 ? 'medium-risk' : 'low-risk'}">
          ${irpData.riskLevel}
        </div>
      </div>
      <div class="irp-interpretation">
        <strong>Interpretación:</strong> ${irpData.interpretation}
      </div>
      <div class="irp-advice">
        <div class="advice-icon">💡</div>
        <div>
          <strong>Consejo personalizado:</strong><br/>
          ${irpData.advice}
        </div>
      </div>
    </div>
  ` : '';

  // Sección de factores (solo básico y premium)
  const factorsHTML = level !== 'free' && data.factors.length > 0 ? `
    <div class="section">
      <h3>Factores de Riesgo Evaluados</h3>
      ${data.factors.map(f => `
        <div class="factor">
          <div class="factor-header">
            <span class="factor-name">${f.name}</span>
            <span class="factor-value ${f.value.toLowerCase()}">${f.value}</span>
          </div>
          <div class="factor-bar">
            <div class="factor-fill" style="width: ${f.impact * 6}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  // Sinergias (solo básico y premium)
  const synergiesHTML = level !== 'free' && data.synergies?.length ? `
    <div class="section">
      <h3>Factores Combinados Identificados</h3>
      <ul class="synergies">
        ${data.synergies.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  // Recomendaciones (solo básico y premium)
  const recommendationsHTML = level !== 'free' && data.recommendations.length > 0 ? `
    <div class="section">
      <h3>Recomendaciones Personalizadas</h3>
      ${data.recommendations.map(r => `
        <div class="recommendation">
          <div class="rec-icon">✓</div>
          <div class="rec-content">
            <strong>${r.text}</strong>
            <p>${r.evidence}</p>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  // CTA para upgrade (según nivel)
  const upgradeCTA = level === 'free' ? `
    <div class="upgrade-cta">
      <h3>🚀 Obtén tu Plan de Acción Completo</h3>
      <p>Desbloquea el análisis detallado de todos tus factores de riesgo, tu potencial de mejora y recomendaciones personalizadas.</p>
      <div class="upgrade-price">$14.900 CLP</div>
      <a href="https://implantx.cl/evaluacion" class="upgrade-button">Obtener Plan de Acción</a>
    </div>
  ` : level === 'basic' ? `
    <div class="upgrade-cta premium">
      <h3>👑 Mejora a Premium</h3>
      <p>Añade simulación de sonrisa con IA, estimación de costos y consulta prioritaria.</p>
      <div class="upgrade-price">+$15.000 CLP</div>
      <a href="https://implantx.cl/evaluacion" class="upgrade-button">Obtener Informe Premium</a>
    </div>
  ` : '';

  // Secciones premium exclusivas
  const premiumSectionsHTML = level === 'premium' ? `
    <div class="section premium-badge-section">
      <div class="premium-seal">
        <span class="seal-icon">👑</span>
        <span>Cliente Premium ImplantX</span>
      </div>
    </div>
    <div class="section">
      <h3>🎯 Tu Plan de Tratamiento Personalizado</h3>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-marker">1</div>
          <div class="timeline-content">
            <strong>Evaluación Inicial</strong>
            <p>Consulta con especialista y radiografía panorámica</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">2</div>
          <div class="timeline-content">
            <strong>Preparación</strong>
            <p>Tratamiento periodontal si es necesario</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">3</div>
          <div class="timeline-content">
            <strong>Cirugía de Implante</strong>
            <p>Colocación del implante dental</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">4</div>
          <div class="timeline-content">
            <strong>Oseointegración</strong>
            <p>Período de cicatrización (3-6 meses)</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">5</div>
          <div class="timeline-content">
            <strong>Prótesis Final</strong>
            <p>Colocación de la corona definitiva</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <h3>💰 Estimación de Costos</h3>
      <div class="cost-table">
        <div class="cost-row">
          <span>Implante unitario (incluye corona)</span>
          <span>$850.000 - $1.200.000 CLP</span>
        </div>
        <div class="cost-row">
          <span>Injerto óseo (si aplica)</span>
          <span>$300.000 - $500.000 CLP</span>
        </div>
        <div class="cost-row">
          <span>Tratamiento periodontal previo</span>
          <span>$150.000 - $350.000 CLP</span>
        </div>
        <div class="cost-note">
          * Los valores son referenciales y pueden variar según la clínica y complejidad del caso.
        </div>
      </div>
    </div>
  ` : '';

  // Obtener título según nivel
  const getReportTitle = () => {
    switch (level) {
      case 'free': return 'IRP - Informe Gratuito';
      case 'basic': return 'Plan de Acción ImplantX';
      case 'premium': return 'Informe Premium ImplantX';
    }
  };

  const getBadgeClass = () => {
    switch (level) {
      case 'free': return 'badge-free';
      case 'basic': return 'badge-basic';
      case 'premium': return 'badge-premium';
    }
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getReportTitle()} - ${data.patientName || 'Paciente'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: #fafafa;
      line-height: 1.6;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: linear-gradient(165deg, #0d0d0d 0%, #1a1510 50%, #0d0d0d 100%);
      border: 1px solid rgba(201, 168, 124, 0.3);
      border-radius: 24px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, rgba(201, 168, 124, 0.15) 0%, transparent 100%);
      padding: 40px;
      text-align: center;
      border-bottom: 1px solid rgba(201, 168, 124, 0.2);
    }
    
    .logo { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
    .logo span { color: #c9a87c; }
    
    .report-badge {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    .badge-free { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .badge-basic { background: rgba(201, 168, 124, 0.2); color: #c9a87c; }
    .badge-premium { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    
    .subtitle { color: #888; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; }
    
    .patient-info {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .patient-info span { color: #888; font-size: 13px; }
    .patient-info strong { color: #fafafa; }
    
    .main-result {
      padding: 50px 40px;
      text-align: center;
      background: radial-gradient(circle at center, rgba(201, 168, 124, 0.1) 0%, transparent 70%);
    }
    
    .success-range { font-size: 48px; font-weight: 700; color: #c9a87c; margin-bottom: 8px; }
    .success-label { font-size: 14px; color: #888; margin-bottom: 16px; }
    
    .pronostico-badge {
      display: inline-block;
      background: rgba(201, 168, 124, 0.2);
      color: #c9a87c;
      padding: 8px 24px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .pronostico-message { color: #aaa; max-width: 500px; margin: 0 auto; font-size: 15px; }
    
    .content { padding: 40px; }
    
    .section { margin-bottom: 40px; }
    .section h3 {
      font-size: 18px;
      color: #c9a87c;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(201, 168, 124, 0.2);
    }
    
    /* IRP Section Styles */
    .irp-section { background: rgba(201, 168, 124, 0.05); border-radius: 16px; padding: 24px; }
    
    .irp-score-container { text-align: center; margin: 20px 0; }
    
    .irp-circle {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 6px solid;
      margin-bottom: 16px;
    }
    
    .irp-circle.low-risk { border-color: #22c55e; }
    .irp-circle.medium-risk { border-color: #f59e0b; }
    .irp-circle.high-risk { border-color: #ef4444; }
    
    .score-value { font-size: 36px; font-weight: 700; }
    .score-label { font-size: 14px; color: #888; }
    
    .irp-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .irp-badge.low-risk { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .irp-badge.medium-risk { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .irp-badge.high-risk { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    
    .irp-interpretation {
      background: rgba(0,0,0,0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
    }
    
    .irp-advice {
      display: flex;
      gap: 12px;
      background: rgba(201, 168, 124, 0.1);
      border: 1px solid rgba(201, 168, 124, 0.2);
      border-radius: 12px;
      padding: 16px;
    }
    
    .advice-icon { font-size: 24px; }
    
    /* Factor Styles */
    .factor { margin-bottom: 16px; }
    .factor-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .factor-name { font-weight: 500; }
    .factor-value { font-size: 12px; padding: 2px 10px; border-radius: 10px; }
    .factor-value.alto { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .factor-value.medio { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .factor-value.bajo { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .factor-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .factor-fill { height: 100%; background: linear-gradient(90deg, #c9a87c, #e0c9a8); border-radius: 3px; }
    
    /* Recommendations */
    .recommendation {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: rgba(201, 168, 124, 0.08);
      border: 1px solid rgba(201, 168, 124, 0.2);
      border-radius: 12px;
      margin-bottom: 12px;
    }
    
    .rec-icon {
      width: 28px;
      height: 28px;
      background: rgba(201, 168, 124, 0.2);
      color: #c9a87c;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .rec-content strong { display: block; margin-bottom: 4px; }
    .rec-content p { font-size: 13px; color: #888; }
    
    /* Synergies */
    .synergies { list-style: none; }
    .synergies li {
      padding: 12px 16px;
      background: rgba(245, 158, 11, 0.1);
      border-left: 3px solid #f59e0b;
      margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
    }
    
    /* Upgrade CTA */
    .upgrade-cta {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
      border: 2px dashed rgba(34, 197, 94, 0.3);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      margin: 32px 0;
    }
    
    .upgrade-cta.premium {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
      border-color: rgba(245, 158, 11, 0.3);
    }
    
    .upgrade-cta h3 { color: #fafafa; margin-bottom: 12px; border: none; padding: 0; }
    .upgrade-cta p { color: #888; margin-bottom: 16px; }
    
    .upgrade-price {
      font-size: 28px;
      font-weight: 700;
      color: #22c55e;
      margin-bottom: 16px;
    }
    
    .upgrade-cta.premium .upgrade-price { color: #f59e0b; }
    
    .upgrade-button {
      display: inline-block;
      background: #c9a87c;
      color: #0a0a0a;
      padding: 12px 32px;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .upgrade-button:hover { background: #e0c9a8; }
    
    /* Premium Sections */
    .premium-badge-section { text-align: center; }
    
    .premium-seal {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
    }
    
    .seal-icon { font-size: 20px; }
    
    .timeline { padding-left: 20px; }
    
    .timeline-item {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      position: relative;
    }
    
    .timeline-item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 40px;
      width: 2px;
      height: calc(100% + 4px);
      background: rgba(201, 168, 124, 0.3);
    }
    
    .timeline-marker {
      width: 32px;
      height: 32px;
      background: #c9a87c;
      color: #0a0a0a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .timeline-content strong { display: block; margin-bottom: 4px; }
    .timeline-content p { font-size: 13px; color: #888; }
    
    .cost-table { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; }
    
    .cost-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .cost-row:last-of-type { border-bottom: none; }
    .cost-row span:last-child { color: #c9a87c; font-weight: 600; }
    
    .cost-note {
      margin-top: 16px;
      font-size: 11px;
      color: #666;
      font-style: italic;
    }
    
    .footer {
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid rgba(201, 168, 124, 0.2);
      background: rgba(0,0,0,0.3);
    }
    
    .footer-logo { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .footer-logo span { color: #c9a87c; }
    .footer p { font-size: 11px; color: #666; }
    .footer a { color: #c9a87c; text-decoration: none; }
    
    @media print {
      body { padding: 0; background: white; color: #1a1a1a; }
      .container { border: none; box-shadow: none; }
      .upgrade-cta { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Implant<span>X</span>™</div>
      <div class="report-badge ${getBadgeClass()}">${level === 'free' ? 'GRATUITO' : level === 'basic' ? 'BÁSICO' : 'PREMIUM'}</div>
      <div class="subtitle">${getReportTitle()}</div>
      <div class="patient-info">
        <span><strong>${data.patientName || 'Paciente'}</strong></span>
        <span>ID: <strong>${data.id}</strong></span>
        <span>Fecha: <strong>${data.date}</strong></span>
      </div>
    </div>
    
    ${level !== 'free' ? `
    <div class="main-result">
      <div class="success-range">${data.successRange}</div>
      <div class="success-label">Rango de éxito estimado*</div>
      <div class="pronostico-badge">${data.pronosticoLabel}</div>
      <p class="pronostico-message">${data.pronosticoMessage}</p>
    </div>
    ` : ''}
    
    <div class="content">
      ${irpSectionHTML}
      
      <div class="section" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 20px;">
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 24px;">⚠️</span>
          <div>
            <strong style="color: #fafafa;">Importante: Esta es una "Foto" de tu Situación Actual</strong>
            <p style="color: #888; margin-top: 8px; font-size: 14px;">
              El porcentaje de éxito estimado representa tu situación actual. 
              Este valor puede mejorar significativamente si trabajas en los factores de riesgo modificables.
            </p>
          </div>
        </div>
      </div>
      
      ${factorsHTML}
      ${synergiesHTML}
      ${recommendationsHTML}
      ${premiumSectionsHTML}
      ${upgradeCTA}
    </div>
    
    <div class="footer">
      <div class="footer-logo">Implant<span>X</span>™</div>
      <p>Powered by <a href="https://humanaia.cl">humana.ia</a></p>
      <p style="margin-top: 8px;">© 2025 ImplantX · Este reporte es orientativo. La evaluación final debe ser realizada por un especialista.</p>
    </div>
  </div>
</body>
</html>
  `;
}
