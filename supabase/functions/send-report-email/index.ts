import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendReportRequest {
  email: string;
  patientName: string;
  reportLevel: 'free' | 'basic' | 'premium';
  paymentId?: string;
  irpData?: {
    score: number;
    riskLevel: string;
    interpretation: string;
    advice: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, patientName, reportLevel, paymentId, irpData }: SendReportRequest = await req.json();
    console.log(`Sending ${reportLevel} report to ${email}`);

    const subject = reportLevel === 'free' 
      ? `${patientName}, tu Informe IRP Gratuito`
      : reportLevel === 'basic'
      ? `${patientName}, tu Plan de Acción ImplantX`
      : `${patientName}, tu Informe Premium ImplantX 👑`;

    const htmlContent = `
      <html>
        <body style="font-family: system-ui, sans-serif; background: #f5f5f5; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1a1510, #2d2419); padding: 32px; text-align: center;">
              <h1 style="color: #fafafa; margin: 0;">Implant<span style="color: #c9a87c;">X</span>™</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #1a1a1a;">Hola ${patientName},</h2>
              <p style="color: #666;">Tu informe ${reportLevel === 'free' ? 'IRP Gratuito' : reportLevel === 'basic' ? 'Plan de Acción' : 'Premium'} está listo.</p>
              ${irpData ? `<p style="color: #666;">Tu puntaje IRP: <strong>${irpData.score}/100</strong> - ${irpData.riskLevel}</p>` : ''}
              <p style="color: #666; margin-top: 24px;">Visita <a href="https://implantx.cl" style="color: #c9a87c;">implantx.cl</a> para ver tu informe completo.</p>
            </div>
            <div style="background: #f5f5f5; padding: 20px; text-align: center;">
              <p style="color: #888; font-size: 12px;">© 2025 ImplantX</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ImplantX <onboarding@resend.dev>",
        to: [email],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    console.log("Email sent:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
