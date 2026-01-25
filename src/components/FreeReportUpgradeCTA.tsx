import { Crown, CreditCard, CheckCircle2, Sparkles, X, Lock, Eye, TrendingUp, Target, Zap } from "lucide-react";
import MercadoPagoButton from "./MercadoPagoButton";
import CountdownOffer from "./CountdownOffer";
import LockedPremiumSection from "./LockedPremiumSection";
import { REPORT_PRICES } from "@/types/reportLevels";
import { cn } from "@/lib/utils";

interface FreeReportUpgradeCTAProps {
  onBasicUpgrade?: () => void;
}

const FreeReportUpgradeCTA = ({ onBasicUpgrade }: FreeReportUpgradeCTAProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  // Comparison table features
  const features = [
    { name: "Score IRP", free: true, paid: true },
    { name: "Nivel de riesgo", free: true, paid: true },
    { name: "Consejo básico", free: true, paid: true },
    { name: "Factores detectados", free: "2 de 6+", paid: "TODOS" },
    { name: "Tu Potencial de Mejora", free: false, paid: true, highlight: true },
    { name: "Plan de Acción paso a paso", free: false, paid: true, highlight: true },
    { name: "Recomendaciones personalizadas", free: false, paid: true },
    { name: "Próximos pasos claros", free: false, paid: true },
  ];

  const renderValue = (value: boolean | string, highlight?: boolean) => {
    if (value === true) {
      return <CheckCircle2 className={cn("w-4 h-4", highlight ? "text-primary" : "text-success")} />;
    }
    if (value === false) {
      return <X className="w-4 h-4 text-muted-foreground/30" />;
    }
    return <span className="text-xs text-warning font-medium">{value}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header with urgency */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30">
          <Lock className="w-4 h-4 text-destructive" />
          <span className="text-sm font-bold text-destructive">CONTENIDO BLOQUEADO</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Te estás perdiendo información crítica
        </h3>
        <p className="text-sm text-muted-foreground">
          Tu informe gratuito solo muestra el 30% del análisis completo
        </p>
      </div>

      {/* Blurred sections preview */}
      <div className="grid sm:grid-cols-2 gap-3">
        <LockedPremiumSection 
          title="Potencial de Mejora"
          blurIntensity="heavy"
          showTeaser={false}
          className="h-32"
        />
        <LockedPremiumSection 
          title="Plan de Acción"
          blurIntensity="heavy"
          showTeaser={false}
          className="h-32"
        />
      </div>

      {/* Countdown offer */}
      <CountdownOffer 
        durationMinutes={120}
        originalPrice={REPORT_PRICES.basic}
        discountPercent={20}
        variant="inline"
      />

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-3 bg-muted/50 text-center">
          <div className="p-3 text-xs font-semibold text-muted-foreground">Característica</div>
          <div className="p-3">
            <p className="text-xs font-semibold text-muted-foreground">GRATIS</p>
            <p className="text-sm font-bold text-foreground">Actual</p>
          </div>
          <div className="p-3 bg-primary/10">
            <div className="flex items-center justify-center gap-1">
              <Crown className="w-3 h-3 text-primary" />
              <p className="text-xs font-bold text-primary">COMPLETO</p>
            </div>
            <p className="text-sm font-bold text-primary">${formatPrice(REPORT_PRICES.basic)}</p>
          </div>
        </div>

        {features.map((feature, i) => (
          <div 
            key={i}
            className={cn(
              "grid grid-cols-3 border-t border-border text-center",
              feature.highlight && "bg-primary/5"
            )}
          >
            <div className="p-2.5 text-xs text-foreground text-left flex items-center">
              {feature.name}
              {feature.highlight && (
                <span className="ml-1.5 px-1 py-0.5 text-[8px] font-bold bg-primary text-primary-foreground rounded">
                  CLAVE
                </span>
              )}
            </div>
            <div className="p-2.5 flex items-center justify-center">
              {renderValue(feature.free)}
            </div>
            <div className="p-2.5 flex items-center justify-center bg-primary/5">
              {renderValue(feature.paid, feature.highlight)}
            </div>
          </div>
        ))}
      </div>

      {/* Main CTA */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 shadow-xl shadow-primary/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative space-y-4">
          {/* Value list */}
          <div className="grid gap-2">
            {[
              "Análisis de TODOS tus factores de riesgo",
              "Tu Potencial de Mejora exacto (%)",
              "Plan de acción paso a paso",
              "Recomendaciones de especialistas"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* Price and button */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg line-through text-muted-foreground">${formatPrice(REPORT_PRICES.basic)}</span>
              <span className="text-3xl font-bold text-primary">${formatPrice(Math.round(REPORT_PRICES.basic * 0.8))}</span>
              <span className="text-sm text-muted-foreground">CLP</span>
            </div>
            <MercadoPagoButton tier="basic" />
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CreditCard className="w-3 h-3" />
              Hasta 3 cuotas sin interés
            </p>
          </div>

          {/* Premium teaser */}
          <div className="border-t border-border/50 pt-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs font-semibold text-foreground">¿Quieres más?</p>
                  <p className="text-[10px] text-muted-foreground">Simulación de Sonrisa + Análisis IA</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-warning">${formatPrice(REPORT_PRICES.premium)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <p className="text-center text-xs text-muted-foreground">
        💰 Garantía de devolución de 7 días si no estás satisfecho
      </p>
    </div>
  );
};

export default FreeReportUpgradeCTA;
