import { useEffect, useRef } from "react";
import { MERCADOPAGO_PREFERENCES } from "@/types/reportLevels";

interface MercadoPagoButtonProps {
  preferenceId?: string;
  tier?: 'basic' | 'premium' | 'upgrade';
  className?: string;
}

const MercadoPagoButton = ({ preferenceId, tier, className }: MercadoPagoButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Determine the preference ID based on tier or use the provided one
  const finalPreferenceId = preferenceId || (tier ? MERCADOPAGO_PREFERENCES[tier] : MERCADOPAGO_PREFERENCES.basic);
  const scriptId = `mp-script-${finalPreferenceId}`;

  useEffect(() => {
    // Check if script already exists
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js";
    script.setAttribute("data-preference-id", finalPreferenceId);
    script.setAttribute("data-source", "button");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [finalPreferenceId, scriptId]);

  return <div ref={containerRef} className={`flex justify-center ${className || ''}`} />;
};

export default MercadoPagoButton;
