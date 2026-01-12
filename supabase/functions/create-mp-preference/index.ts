import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PreferenceRequest {
  tier: 'basic' | 'premium' | 'upgrade';
  patientName?: string;
  patientEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN');
    
    if (!MP_ACCESS_TOKEN) {
      throw new Error('MP_ACCESS_TOKEN no configurado');
    }

    const { tier, patientName, patientEmail }: PreferenceRequest = await req.json();

    // Define pricing and URLs based on tier
    const BASE_URL = 'https://implantx.cl';
    
    const tierConfig = {
      basic: {
        title: 'ImplantX - Plan de Acción Básico',
        description: 'Análisis completo de factores de riesgo y plan de acción personalizado',
        unit_price: 14900,
        success_url: `${BASE_URL}/gracias-basico`,
        failure_url: `${BASE_URL}/evaluacion?payment_status=failure`,
        pending_url: `${BASE_URL}/evaluacion?payment_status=pending`,
      },
      premium: {
        title: 'ImplantX - Informe Premium Completo',
        description: 'Simulación de sonrisa con IA, estimación de costos y guía completa',
        unit_price: 29990,
        success_url: `${BASE_URL}/gracias-premium`,
        failure_url: `${BASE_URL}/evaluacion?payment_status=failure`,
        pending_url: `${BASE_URL}/evaluacion?payment_status=pending`,
      },
      upgrade: {
        title: 'ImplantX - Upgrade a Premium',
        description: 'Actualización: simulación de sonrisa, costos y guía completa',
        unit_price: 15000,
        success_url: `${BASE_URL}/gracias-premium`,
        failure_url: `${BASE_URL}/gracias-basico?payment_status=failure`,
        pending_url: `${BASE_URL}/gracias-basico?payment_status=pending`,
      },
    };

    const config = tierConfig[tier];

    if (!config) {
      throw new Error(`Tier inválido: ${tier}`);
    }

    // Create MercadoPago preference
    const preferenceData = {
      items: [
        {
          title: config.title,
          description: config.description,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: config.unit_price,
        },
      ],
      payer: {
        name: patientName || '',
        email: patientEmail || '',
      },
      back_urls: {
        success: config.success_url,
        failure: config.failure_url,
        pending: config.pending_url,
      },
      auto_return: 'approved',
      external_reference: `implantx_${tier}_${Date.now()}`,
      statement_descriptor: 'IMPLANTX',
      metadata: {
        tier,
        patient_name: patientName,
        patient_email: patientEmail,
      },
    };

    console.log('Creating MercadoPago preference:', JSON.stringify(preferenceData, null, 2));

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('MercadoPago API error:', errorData);
      throw new Error(`Error de MercadoPago: ${response.status} - ${errorData}`);
    }

    const preference = await response.json();

    console.log('Preference created successfully:', preference.id);

    return new Response(
      JSON.stringify({
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error creating preference:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
