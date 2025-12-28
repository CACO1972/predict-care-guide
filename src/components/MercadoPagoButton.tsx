import { useEffect, useRef } from "react";

interface MercadoPagoButtonProps {
  preferenceId: string;
}

const MercadoPagoButton = ({ preferenceId }: MercadoPagoButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptId = `mp-script-${preferenceId}`;

  useEffect(() => {
    // Check if script already exists
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js";
    script.setAttribute("data-preference-id", preferenceId);
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
  }, [preferenceId, scriptId]);

  return <div ref={containerRef} className="flex justify-center" />;
};

export default MercadoPagoButton;
