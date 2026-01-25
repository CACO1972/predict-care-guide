import { ArrowRight, Play, Pause, Clock, Shield, Sparkles, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import rioThumbnail from "@/assets/rio-video-thumbnail.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatedUsers, setAnimatedUsers] = useState(0);

  // Animate user counter
  useEffect(() => {
    const target = 2847;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedUsers(target);
        clearInterval(timer);
      } else {
        setAnimatedUsers(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const benefits = [
    { icon: Clock, text: "5 minutos", subtext: "evaluación completa" },
    { icon: Shield, text: "100% privado", subtext: "datos protegidos" },
    { icon: Sparkles, text: "IA avanzada", subtext: "análisis preciso" },
  ];

  return (
    <div className="max-w-6xl mx-auto text-center pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12">
      {/* Live Stats Banner */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-foreground">
            <span className="text-primary font-bold">{animatedUsers.toLocaleString()}</span> evaluaciones realizadas
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-success" />
          <span>94% de precisión clínica</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Copy */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          {/* Problem Statement */}
          <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto lg:mx-0">
            ¿Necesitas implantes dentales pero no sabes si eres candidato?
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
            <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Descubre tu elegibilidad
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              antes de ir al dentista
            </span>
          </h1>

          {/* Value Props */}
          <p className="text-base sm:text-lg text-foreground/80 font-medium mb-6 max-w-lg mx-auto lg:mx-0">
            Ahorra hasta <span className="text-primary font-bold">$400.000</span> en viajes y consultas innecesarias con nuestra evaluación de IA.
          </p>

          {/* Benefits Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <benefit.icon className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{benefit.text}</p>
                  <p className="text-[10px] text-muted-foreground">{benefit.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-6">
            <button
              onClick={() => navigate("/evaluacion")}
              className="w-full sm:w-auto px-8 h-14 sm:h-16 flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground text-base sm:text-lg font-bold hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <span>Comenzar Evaluación Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Sin registro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Resultados inmediatos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Validado clínicamente</span>
            </div>
          </div>
        </div>

        {/* Right: Video */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative w-56 sm:w-64 md:w-72 lg:w-80">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-3xl opacity-60" />
            
            {/* Decorative ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 via-transparent to-primary/20 opacity-50" />
            
            {/* Video container with 9:16 aspect ratio */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-background aspect-[9/16]">
              <video
                key="hero-intro-v5"
                ref={videoRef}
                src="/hero-intro-v5.mp4"
                poster={rioThumbnail}
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageRendering: 'auto' }}
              />
              
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className={`absolute transition-all duration-500 ease-out ${
                  isPlaying 
                    ? 'bottom-3 right-3 opacity-70 hover:opacity-100' 
                    : 'inset-0 flex items-center justify-center'
                }`}
              >
                <div className={`rounded-full bg-primary/95 hover:bg-primary flex items-center justify-center shadow-xl shadow-primary/40 transition-all duration-300 hover:scale-110 ${
                  isPlaying ? 'w-12 h-12' : 'w-16 h-16 sm:w-20 sm:h-20'
                }`}>
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-1" />
                  )}
                </div>
              </button>
              
              {/* Video label */}
              {!isPlaying && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-primary/30 text-xs font-medium text-foreground">
                    🎬 Conoce a Río
                  </span>
                </div>
              )}

              {/* Floating badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg">
                IA ACTIVA
              </div>
            </div>

            {/* Avatar indicator */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-background flex items-center justify-center text-[8px] font-bold text-primary">R</div>
              </div>
              <span className="text-[11px] font-medium text-foreground">Tu asistente dental</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Social Proof */}
      <div className="mt-16 sm:mt-20 pt-8 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest">
          Respaldado por especialistas
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-60">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">94%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Precisión clínica</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">2.8K+</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Evaluaciones</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">5 min</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Tiempo promedio</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary">Gratis</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Evaluación inicial</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
