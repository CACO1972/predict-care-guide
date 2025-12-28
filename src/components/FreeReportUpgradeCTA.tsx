import { Button } from "@/components/ui/button";
import { Crown, CreditCard, ArrowRight, CheckCircle2, Sparkles, Lock } from "lucide-react";
import MercadoPagoButton from "./MercadoPagoButton";
import { MERCADOPAGO_PREFERENCES, REPORT_PRICES } from "@/types/reportLevels";

interface FreeReportUpgradeCTAProps {
  onBasicUpgrade?: () => void;
}

const FreeReportUpgradeCTA = ({ onBasicUpgrade }: FreeReportUpgradeCTAProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  return (
    <div className="space-y-4">
      {/* Upgrade CTA Principal */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 shadow-xl shadow-primary/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">MEJORA TU INFORME</span>
            </div>
            <h4 className="text-lg font-bold text-foreground">
              Obtén tu Plan de Acción Completo
            </h4>
            <p className="text-sm text-muted-foreground">
              Descubre cómo mejorar significativamente tus probabilidades de éxito
            </p>
          </div>

          {/* Lo que incluye */}
          <div className="bg-background/50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground">El Plan de Acción incluye:</p>
            <div className="grid gap-2">
              {[
                "Gráfica de tu potencial de mejora",
                "Lista completa de acciones recomendadas",
                "Análisis de tus factores de riesgo",
                "Recomendaciones personalizadas",
                "Próximos pasos claros"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precio y botón */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-primary">${formatPrice(REPORT_PRICES.basic)}</span>
              <span className="text-sm text-muted-foreground">CLP</span>
            </div>
            <MercadoPagoButton preferenceId={MERCADOPAGO_PREFERENCES.basic} />
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CreditCard className="w-3 h-3" />
              Pago seguro con MercadoPago
            </p>
          </div>

          {/* Opción Premium teaser */}
          <div className="border-t border-border/50 pt-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-xs font-semibold text-foreground">¿Quieres más?</p>
                  <p className="text-[10px] text-muted-foreground">Añade Simulación de Sonrisa IA</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-600">${formatPrice(REPORT_PRICES.premium)}</span>
                <p className="text-[10px] text-muted-foreground">CLP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeReportUpgradeCTA;
