import { MessageCircle, Camera, ClipboardCheck, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: MessageCircle,
    step: "1",
    title: "Conversa con Río",
    description: "Nuestra IA te hace preguntas simples sobre tu salud bucal en menos de 5 minutos",
    highlight: "Sin términos técnicos",
  },
  {
    icon: Camera,
    step: "2",
    title: "Sube una foto",
    description: "Opcional: agrega una imagen de tu boca para un análisis más preciso",
    badge: "Opcional",
    highlight: "Mejora la precisión",
  },
  {
    icon: ClipboardCheck,
    step: "3",
    title: "Análisis con IA",
    description: "Evaluamos factores de riesgo basados en evidencia científica y guías clínicas",
    highlight: "94% precisión",
  },
  {
    icon: FileText,
    step: "4",
    title: "Tu reporte listo",
    description: "Recibe recomendaciones claras sobre si eres candidato y los próximos pasos",
    highlight: "Al instante",
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto mb-16 sm:mb-24">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          Proceso Simple
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
          ¿Cómo funciona?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          De la duda a la claridad en 4 pasos simples
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="relative">
        {/* Connection line - desktop */}
        <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
            >
              {/* Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-card to-card/50 border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 h-full">
                {/* Step indicator */}
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  {step.step}
                </div>

                {/* Optional badge */}
                {"badge" in step && step.badge && (
                  <div className="absolute -top-3 right-4 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-medium border border-border">
                    {step.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mt-3 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Highlight tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-[10px] sm:text-xs font-medium text-success">
                    {step.highlight}
                  </span>
                </div>
              </div>

              {/* Arrow connector - mobile/tablet */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2 lg:hidden">
                  <ArrowRight className="w-5 h-5 text-primary/40 rotate-90 sm:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10 sm:mt-14">
        <button
          onClick={() => navigate("/evaluacion")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-card border-2 border-primary/30 text-foreground font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
        >
          <span>Comenzar ahora</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          Solo toma 5 minutos · Es gratis
        </p>
      </div>
    </div>
  );
};

export default HowItWorksSection;
