import { CheckCircle2, X, Crown, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MercadoPagoButton from "./MercadoPagoButton";

interface PremiumComparisonTableProps {
  highlightPremium?: boolean;
  className?: string;
}

const PremiumComparisonTable = ({ highlightPremium = true, className }: PremiumComparisonTableProps) => {
  const features = [
    { name: "Score IRP (Índice de Riesgo)", free: true, basic: true, premium: true },
    { name: "Nivel de riesgo general", free: true, basic: true, premium: true },
    { name: "Consejo básico de Río", free: true, basic: true, premium: true },
    { name: "Factores de riesgo detectados", free: "solo 2", basic: true, premium: true },
    { name: "Análisis de todos tus factores", free: false, basic: true, premium: true },
    { name: "Tu Potencial de Mejora (%)", free: false, basic: true, premium: true },
    { name: "Plan de acción paso a paso", free: false, basic: true, premium: true },
    { name: "Recomendaciones personalizadas", free: false, basic: true, premium: true },
    { name: "Mapa de zonas afectadas", free: false, basic: false, premium: true, highlight: true },
    { name: "Simulación de Sonrisa IA", free: false, basic: false, premium: true, highlight: true },
    { name: "Análisis de tu imagen dental", free: false, basic: false, premium: true, highlight: true },
    { name: "Timeline de tratamiento", free: false, basic: false, premium: true, highlight: true },
    { name: "Estimación de costos", free: false, basic: false, premium: true, highlight: true },
  ];

  const renderValue = (value: boolean | string, highlight?: boolean) => {
    if (value === true) {
      return <CheckCircle2 className={cn("w-5 h-5", highlight ? "text-amber-500" : "text-green-500")} />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-muted-foreground/30" />;
    }
    return <span className="text-xs text-amber-600 font-medium">{value}</span>;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          ¿Qué te estás perdiendo?
        </h3>
        <p className="text-sm text-muted-foreground">
          Compara lo que incluye cada plan
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-border">
        {/* Column Headers */}
        <div className="grid grid-cols-4 bg-muted/50">
          <div className="p-3 text-xs font-semibold text-muted-foreground">
            Característica
          </div>
          <div className="p-3 text-center">
            <span className="text-xs font-semibold text-muted-foreground">Gratis</span>
            <p className="text-lg font-bold text-foreground">$0</p>
          </div>
          <div className="p-3 text-center bg-primary/5 border-x border-primary/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">BÁSICO</span>
            </div>
            <p className="text-lg font-bold text-primary">$14.990</p>
          </div>
          <div className={cn(
            "p-3 text-center",
            highlightPremium && "bg-gradient-to-b from-amber-500/20 to-amber-500/5"
          )}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">PREMIUM</span>
            </div>
            <p className="text-lg font-bold text-amber-600">$29.000</p>
          </div>
        </div>

        {/* Feature Rows */}
        {features.map((feature, i) => (
          <div 
            key={i}
            className={cn(
              "grid grid-cols-4 border-t border-border",
              feature.highlight && "bg-amber-500/5"
            )}
          >
            <div className="p-3 text-sm text-foreground flex items-center">
              {feature.name}
              {feature.highlight && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                  NUEVO
                </span>
              )}
            </div>
            <div className="p-3 flex items-center justify-center">
              {renderValue(feature.free)}
            </div>
            <div className="p-3 flex items-center justify-center bg-primary/5 border-x border-primary/10">
              {renderValue(feature.basic)}
            </div>
            <div className={cn(
              "p-3 flex items-center justify-center",
              highlightPremium && "bg-amber-500/5"
            )}>
              {renderValue(feature.premium, feature.highlight)}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Plan Básico</p>
            <p className="text-2xl font-bold text-primary">$14.990 <span className="text-sm font-normal text-muted-foreground">CLP</span></p>
          </div>
          <MercadoPagoButton tier="basic" />
        </div>
        
        <div className={cn(
          "p-4 rounded-xl border-2 space-y-3 relative overflow-hidden",
          highlightPremium 
            ? "border-amber-500 bg-gradient-to-br from-amber-500/10 to-orange-500/5" 
            : "border-border bg-card"
        )}>
          {highlightPremium && (
            <div className="absolute -top-1 -right-8 px-10 py-1 bg-amber-500 text-white text-[10px] font-bold rotate-45">
              POPULAR
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Plan Premium</p>
            <p className="text-2xl font-bold text-amber-600">$29.000 <span className="text-sm font-normal text-muted-foreground">CLP</span></p>
          </div>
          <MercadoPagoButton tier="premium" />
        </div>
      </div>

      {/* Money back guarantee */}
      <p className="text-center text-xs text-muted-foreground">
        💰 Garantía de devolución de 7 días si no estás satisfecho
      </p>
    </div>
  );
};

export default PremiumComparisonTable;
