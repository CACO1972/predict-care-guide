import { Shield, Award, Users, CheckCircle2, FileCheck, ExternalLink, Lock, Cpu, Stethoscope } from "lucide-react";

const trustPoints = [
  {
    icon: Stethoscope,
    title: "Validación Clínica",
    description: "Algoritmo basado en protocolos internacionales y literatura científica revisada",
    stat: "94%",
    statLabel: "precisión",
  },
  {
    icon: Lock,
    title: "Datos Protegidos",
    description: "Cumplimiento total con Ley 19.628 de protección de datos personales de Chile",
    stat: "100%",
    statLabel: "privado",
  },
  {
    icon: Cpu,
    title: "IA Avanzada",
    description: "Modelo predictivo entrenado con miles de casos clínicos reales",
    stat: "2.8K+",
    statLabel: "casos",
  },
];

const TrustSection = () => {
  return (
    <div className="max-w-5xl mx-auto mb-16 sm:mb-24">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs font-semibold text-success uppercase tracking-wider mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Respaldado Científicamente
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
          Tecnología en la que puedes confiar
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Desarrollado por especialistas en implantología con décadas de experiencia clínica
        </p>
      </div>

      {/* Trust Cards */}
      <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {trustPoints.map((point) => (
          <div
            key={point.title}
            className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-card to-card/50 border border-border hover:border-primary/30 transition-all duration-300 group"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative">
              {/* Icon & Stat row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{point.stat}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{point.statLabel}</p>
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Intellectual Property Section */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20">
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          {/* Badge */}
          <a
            href="https://www.safecreative.org/work/2510073245348"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform shrink-0 p-4 rounded-xl bg-background/50 border border-border/50"
          >
            <img
              src="https://resources.safecreative.org/work/2510073245348/label/standard-300"
              alt="Safe Creative - Propiedad Intelectual Registrada"
              className="h-24 sm:h-28"
            />
          </a>

          {/* Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Propiedad Intelectual Registrada
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-xl">
              Algoritmo de predicción sinérgica para implantes dentales inscrito y protegido 
              mediante registro internacional con sello de tiempo certificado.
            </p>
            
            {/* Document Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <a
                href="/docs/SafeCreative_Certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                Ver Certificado
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <a
                href="/docs/SafeCreative_Inscription.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted border border-border text-sm font-medium text-foreground transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                Inscripción de Derechos
              </a>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="relative mt-6 pt-5 border-t border-border/30 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Patent Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Dr. Carlos Montoya</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>Registro: 7 Oct 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
