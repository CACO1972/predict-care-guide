import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, FileText, CreditCard, TrendingUp, Shield, Zap, Lock, Eye, Sparkles } from "lucide-react";
import RioAvatar from "@/components/RioAvatar";
import MercadoPagoButton from "@/components/MercadoPagoButton";
import CountdownOffer from "@/components/CountdownOffer";
import LockedPremiumSection from "@/components/LockedPremiumSection";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { cn } from "@/lib/utils";

interface IRPResultScreenProps {
  gumBleeding: 'never' | 'sometimes' | 'frequently';
  looseTeethLoss: 'no' | '1-2' | 'several';
  oralHygiene: 'less-once' | 'once' | 'twice-plus';
  smoking?: 'no' | 'less-10' | '10-plus';
  diabetes?: 'no' | 'controlled' | 'uncontrolled';
  bruxism?: 'no' | 'unsure' | 'yes';
  patientName?: string;
  patientEmail?: string;
  onPaymentClick: () => void;
  onFreeReportClick: () => void;
}

// Función para calcular el IRP (Índice de Riesgo Periodontal)
const calculateIRP = (
  gumBleeding: string,
  looseTeethLoss: string,
  oralHygiene: string
): number => {
  let score = 100;

  // Sangrado de encías
  if (gumBleeding === 'frequently') score -= 35;
  else if (gumBleeding === 'sometimes') score -= 15;

  // Dientes sueltos perdidos
  if (looseTeethLoss === 'several') score -= 40;
  else if (looseTeethLoss === '1-2') score -= 25;

  // Higiene oral
  if (oralHygiene === 'less-once') score -= 30;
  else if (oralHygiene === 'once') score -= 15;

  return Math.max(0, score);
};

// Función para determinar el nivel de riesgo
const getRiskLevel = (score: number): { level: string; color: string; bgColor: string; icon: React.ReactNode } => {
  if (score <= 40) {
    return {
      level: 'Riesgo Alto',
      color: 'text-destructive',
      bgColor: 'bg-destructive',
      icon: <AlertCircle className="w-6 h-6 text-destructive" />
    };
  } else if (score <= 70) {
    return {
      level: 'Riesgo Moderado',
      color: 'text-warning',
      bgColor: 'bg-warning',
      icon: <AlertTriangle className="w-6 h-6 text-warning" />
    };
  } else {
    return {
      level: 'Riesgo Bajo',
      color: 'text-success',
      bgColor: 'bg-success',
      icon: <CheckCircle2 className="w-6 h-6 text-success" />
    };
  }
};

// Función para obtener la interpretación
const getInterpretation = (score: number): string => {
  if (score <= 40) {
    return "Tus encías necesitan atención urgente antes de cualquier procedimiento dental para asegurar el éxito a largo plazo.";
  } else if (score <= 70) {
    return "Tus encías necesitan atención antes de un procedimiento para asegurar el éxito a largo plazo.";
  } else {
    return "Tus encías están en buen estado. Tienes buenas condiciones para un tratamiento exitoso.";
  }
};

// Función para obtener consejo personalizado
const getPersonalizedAdvice = (
  gumBleeding: string,
  looseTeethLoss: string,
  oralHygiene: string
): string => {
  if (looseTeethLoss === 'several') {
    return "La pérdida de varios dientes por movilidad indica una condición periodontal avanzada. Una evaluación profesional urgente es esencial antes de cualquier tratamiento.";
  }
  if (gumBleeding === 'frequently') {
    return "El sangrado frecuente indica inflamación activa en tus encías. Considera una limpieza profesional y mejora tu rutina de cepillado.";
  }
  if (oralHygiene === 'less-once') {
    return "Cepillarte al menos dos veces al día es fundamental. Esto solo puede mejorar significativamente la salud de tus encías en pocas semanas.";
  }
  if (looseTeethLoss === '1-2') {
    return "Haber perdido dientes por movilidad sugiere problemas periodontales previos. Es importante estabilizar tu salud bucal antes del implante.";
  }
  if (gumBleeding === 'sometimes') {
    return "Tu sangrado ocasional sugiere inflamación leve. Intenta usar hilo dental una vez al día durante una semana y notarás la diferencia.";
  }
  if (oralHygiene === 'once') {
    return "Añadir un segundo cepillado al día, especialmente antes de dormir, mejorará notablemente la salud de tus encías.";
  }
  return "Mantén tus buenos hábitos de higiene oral. Estás en el camino correcto para un tratamiento exitoso.";
};

// Función para detectar factores críticos
interface DetectedFactor {
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

const getDetectedFactors = (
  gumBleeding: string,
  looseTeethLoss: string,
  oralHygiene: string,
  smoking?: string,
  diabetes?: string,
  bruxism?: string
): DetectedFactor[] => {
  const factors: DetectedFactor[] = [];

  // Factores de encías
  if (gumBleeding === 'frequently') {
    factors.push({ name: 'Sangrado frecuente de encías', severity: 'high', description: 'Indica inflamación activa' });
  } else if (gumBleeding === 'sometimes') {
    factors.push({ name: 'Sangrado ocasional', severity: 'medium', description: 'Sugiere inflamación leve' });
  }

  if (looseTeethLoss === 'several') {
    factors.push({ name: 'Pérdida dental múltiple por movilidad', severity: 'high', description: 'Condición periodontal avanzada' });
  } else if (looseTeethLoss === '1-2') {
    factors.push({ name: 'Pérdida dental previa por movilidad', severity: 'medium', description: 'Historial periodontal' });
  }

  if (oralHygiene === 'less-once') {
    factors.push({ name: 'Higiene oral deficiente', severity: 'high', description: 'Requiere mejora urgente' });
  } else if (oralHygiene === 'once') {
    factors.push({ name: 'Higiene oral mejorable', severity: 'medium', description: 'Recomendamos 2+ veces/día' });
  }

  // Factores adicionales si están disponibles
  if (smoking === '10-plus') {
    factors.push({ name: 'Tabaquismo intenso', severity: 'high', description: '+10 cigarrillos/día' });
  } else if (smoking === 'less-10') {
    factors.push({ name: 'Tabaquismo moderado', severity: 'medium', description: 'Afecta cicatrización' });
  }

  if (diabetes === 'uncontrolled') {
    factors.push({ name: 'Diabetes no controlada', severity: 'high', description: 'Requiere estabilización' });
  } else if (diabetes === 'controlled') {
    factors.push({ name: 'Diabetes controlada', severity: 'low', description: 'Buen control glucémico' });
  }

  if (bruxism === 'yes') {
    factors.push({ name: 'Bruxismo', severity: 'medium', description: 'Considerar férula protectora' });
  }

  return factors;
};

const IRPResultScreen = ({
  gumBleeding,
  looseTeethLoss,
  oralHygiene,
  smoking,
  diabetes,
  bruxism,
  patientName = "Paciente",
  patientEmail,
  onPaymentClick,
  onFreeReportClick
}: IRPResultScreenProps) => {
  const score = calculateIRP(gumBleeding, looseTeethLoss, oralHygiene);
  const riskInfo = getRiskLevel(score);
  const interpretation = getInterpretation(score);
  const advice = getPersonalizedAdvice(gumBleeding, looseTeethLoss, oralHygiene);
  const detectedFactors = getDetectedFactors(gumBleeding, looseTeethLoss, oralHygiene, smoking, diabetes, bruxism);
  
  // Guardar datos en localStorage para pasarlos después del pago
  useEffect(() => {
    localStorage.setItem('implantx_irp_data', JSON.stringify({
      score,
      riskLevel: riskInfo.level,
      interpretation,
      advice,
      gumBleeding,
      looseTeethLoss,
      oralHygiene,
      patientName,
      patientEmail
    }));
  }, [score, riskInfo.level, interpretation, advice, gumBleeding, looseTeethLoss, oralHygiene, patientName, patientEmail]);

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'medium': return 'bg-warning/10 border-warning/30 text-warning';
      case 'low': return 'bg-success/10 border-success/30 text-success';
    }
  };

  // Only show first 2 factors for free, rest are blurred
  const visibleFactors = detectedFactors.slice(0, 2);
  const hiddenFactorsCount = Math.max(0, detectedFactors.length - 2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Exit Intent Popup */}
      <ExitIntentPopup patientName={patientName} irpScore={score} />

      {/* Título principal */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Análisis Completado</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          ¡Hemos analizado tus factores clave!
        </h2>
        <p className="text-muted-foreground text-sm">
          {patientName}, estos son los resultados de tu evaluación periodontal
        </p>
      </div>

      {/* Card de resultado principal */}
      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Score visual */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            Tu Índice de Riesgo Periodontal (IRP)
          </p>
          
          {/* Círculo de progreso */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 440} 440`}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score <= 40 ? "text-destructive" : score <= 70 ? "text-warning" : "text-success"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-4xl font-bold", riskInfo.color)}>{score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Nivel de riesgo */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            score <= 40 ? "bg-destructive/10" : score <= 70 ? "bg-warning/10" : "bg-success/10"
          )}>
            {riskInfo.icon}
            <span className={cn("font-semibold", riskInfo.color)}>{riskInfo.level}</span>
          </div>
        </div>

        {/* Barra de progreso alternativa */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Alto Riesgo</span>
            <span>Bajo Riesgo</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-destructive via-warning to-success overflow-hidden">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-foreground rounded-full shadow-md transition-all duration-1000"
              style={{ left: `calc(${score}% - 8px)` }}
            />
          </div>
        </div>

        {/* Factores detectados - mostrar solo 2, el resto blurred */}
        {visibleFactors.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Factores detectados en tu perfil:
            </p>
            <div className="grid gap-2">
              {visibleFactors.map((factor, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    getSeverityColor(factor.severity)
                  )}
                >
                  <div className="flex items-center gap-2">
                    {factor.severity === 'high' && <AlertCircle className="w-4 h-4" />}
                    {factor.severity === 'medium' && <AlertTriangle className="w-4 h-4" />}
                    {factor.severity === 'low' && <CheckCircle2 className="w-4 h-4" />}
                    <span className="font-medium text-sm">{factor.name}</span>
                  </div>
                  <span className="text-xs opacity-80">{factor.description}</span>
                </div>
              ))}
              
              {/* Hidden factors teaser */}
              {hiddenFactorsCount > 0 && (
                <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-primary/5">
                  <div className="blur-[6px] p-3 space-y-2 select-none pointer-events-none">
                    {[1, 2].slice(0, hiddenFactorsCount).map(i => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-muted" />
                          <div className="h-3 bg-muted rounded w-32" />
                        </div>
                        <div className="h-2 bg-muted rounded w-20" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">+{hiddenFactorsCount} factores ocultos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interpretación */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Interpretación:</p>
          <p className="text-sm text-muted-foreground">{interpretation}</p>
        </div>

        {/* Consejo personalizado */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-primary">Consejo de Río:</p>
          </div>
          <p className="text-sm text-foreground/80">{advice}</p>
        </div>
      </div>

      {/* LOCKED SECTIONS - Premium content blur */}
      <div className="space-y-4">
        <LockedPremiumSection 
          title="Tu Potencial de Mejora"
          description="Descubre cuánto puedes aumentar tus probabilidades de éxito"
          blurIntensity="heavy"
        />
        
        <LockedPremiumSection 
          title="Plan de Acción Personalizado"
          description="Acciones concretas paso a paso para mejorar tu caso"
          blurIntensity="medium"
        />
      </div>

      {/* COUNTDOWN OFFER */}
      <CountdownOffer 
        durationMinutes={120}
        originalPrice={14990}
        discountPercent={20}
        variant="banner"
      />

      {/* Sección de valor - Qué incluye el plan de acción */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
        {/* Popular badge */}
        <div className="absolute -top-1 -right-8 px-10 py-1 bg-primary text-primary-foreground text-[10px] font-bold rotate-45">
          POPULAR
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Plan de Acción Completo</h3>
            <p className="text-xs text-muted-foreground">Todo lo que necesitas para mejorar tu pronóstico</p>
          </div>
        </div>
        <div className="grid gap-2">
          {[
            "Análisis detallado de TODOS tus factores de riesgo",
            "Tu Potencial de Mejora: cuánto puedes aumentar tu éxito",
            "Plan paso a paso con acciones concretas",
            "Recomendaciones personalizadas de especialistas",
            "Próximos pasos claros y ordenados",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-foreground/80">{item}</span>
            </div>
          ))}
        </div>
        
        {/* Guarantee badge */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-success/10 border border-success/20">
          <Shield className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Garantía de devolución de 7 días</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón principal - MercadoPago */}
        <div className="space-y-2">
          <MercadoPagoButton tier="basic" />
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
            <CreditCard className="w-3 h-3" />
            Hasta 3 cuotas sin interés con MercadoPago
          </p>
        </div>

        {/* Botón secundario - Gratis */}
        <Button
          onClick={onFreeReportClick}
          variant="ghost"
          className="w-full h-12 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <FileText className="w-4 h-4 mr-2" />
          Solo quiero mi informe IRP gratis por ahora
        </Button>
      </div>

      {/* Nota de confianza */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
        <Shield className="w-4 h-4" />
        <span>Pago 100% seguro. Tu información está protegida.</span>
      </div>
    </div>
  );
};

export default IRPResultScreen;
