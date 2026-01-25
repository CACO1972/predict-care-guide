import { Lock, Sparkles, Eye, TrendingUp, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LockedPremiumSectionProps {
  title: string;
  description?: string;
  blurIntensity?: "light" | "medium" | "heavy";
  showTeaser?: boolean;
  teaserContent?: React.ReactNode;
  className?: string;
}

const LockedPremiumSection = ({ 
  title, 
  description,
  blurIntensity = "heavy",
  showTeaser = true,
  teaserContent,
  className 
}: LockedPremiumSectionProps) => {
  const blurClasses = {
    light: "blur-[2px]",
    medium: "blur-[4px]",
    heavy: "blur-[8px]"
  };

  // Sample hidden content to show blurred
  const sampleContent = teaserContent || (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-2xl font-bold text-primary/40">+{15 + i * 5}%</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30"></div>
            <div className="h-3 bg-muted rounded flex-1" style={{ width: `${60 + i * 10}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-background", className)}>
      {/* Blurred content */}
      <div className={cn("select-none pointer-events-none", blurClasses[blurIntensity])}>
        {sampleContent}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col items-center justify-center p-6">
        {/* Pulsing lock icon */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-foreground text-center mb-1">
          {title}
        </h4>
        
        {description && (
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-3">
            {description}
          </p>
        )}

        {/* What's hidden */}
        {showTeaser && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[
              { icon: Eye, label: "Análisis oculto" },
              { icon: Target, label: "Tu potencial" },
              { icon: Zap, label: "Acciones clave" },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <item.icon className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-600">Disponible en Plan de Acción</span>
        </div>
      </div>
    </div>
  );
};

export default LockedPremiumSection;
