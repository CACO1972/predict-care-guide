import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, FileText, Sparkles, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportPreviewSection = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Gratis",
      price: "$0",
      icon: Zap,
      color: "success",
      features: [
        "Puntuación de riesgo IRP",
        "Factores principales",
        "Orientación general",
      ],
      cta: "Comenzar gratis",
      highlighted: false,
    },
    {
      name: "Básico",
      price: "$14.990",
      icon: FileText,
      color: "primary",
      features: [
        "Todo lo gratuito",
        "Análisis detallado de riesgos",
        "Plan de tratamiento básico",
        "Guía de cuidados pre-implante",
      ],
      cta: "Obtener reporte",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$29.000",
      originalPrice: "$49.990",
      icon: Crown,
      color: "primary",
      features: [
        "Todo lo básico",
        "Simulación de sonrisa con IA",
        "Estimación de costos detallada",
        "Ebook completo sobre implantes",
        "Consulta prioritaria",
      ],
      cta: "Desbloquear Premium",
      highlighted: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mb-16 sm:mb-24">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Reportes Personalizados
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
          Lo que obtendrás
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Elige el nivel de detalle que necesitas para tomar la mejor decisión
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-6 transition-all duration-300 ${
              tier.highlighted
                ? "bg-gradient-to-b from-primary/20 via-primary/10 to-card border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                : "bg-gradient-to-b from-card to-card/50 border border-border hover:border-primary/30"
            }`}
          >
            {/* Popular badge */}
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                MÁS POPULAR
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tier.highlighted ? "bg-primary text-primary-foreground" : "bg-primary/10"
              }`}>
                <tier.icon className={`w-5 h-5 ${tier.highlighted ? "" : "text-primary"}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{tier.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${tier.highlighted ? "text-primary" : "text-foreground"}`}>
                    {tier.price}
                  </span>
                  {tier.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{tier.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    tier.highlighted ? "text-primary" : "text-success"
                  }`} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => navigate("/evaluacion")}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                tier.highlighted
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/50 text-foreground hover:bg-muted"
              }`}
            >
              {tier.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Report Preview Card */}
      <div className="relative mx-auto max-w-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 blur-3xl -z-10 scale-110" />

        <div className="rounded-2xl bg-gradient-to-b from-card to-card/80 border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent px-5 sm:px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Vista previa del reporte
                  </h3>
                  <p className="text-xs text-muted-foreground">Ejemplo de resultados</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                Bueno
              </span>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Success Rate */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">Probabilidad de éxito</span>
                  <span className="text-xs text-muted-foreground">Basado en tu perfil</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-success">85%</span>
                <div className="w-20 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                  <div className="w-[85%] h-full bg-gradient-to-r from-success to-success/80 rounded-full" />
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">Factores de riesgo</span>
                  <span className="text-xs text-muted-foreground">Identificados en tu caso</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-bold border border-warning/20">
                  2
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">Recomendaciones</span>
                  <span className="text-xs text-muted-foreground">Personalizadas para ti</span>
                </div>
              </div>
              <span className="text-sm text-primary font-semibold">3 acciones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewSection;
