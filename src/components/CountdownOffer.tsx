import { useState, useEffect } from "react";
import { Clock, Flame, Gift, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownOfferProps {
  durationMinutes?: number;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  className?: string;
  variant?: "banner" | "inline" | "floating";
  onExpire?: () => void;
}

const CountdownOffer = ({
  durationMinutes = 120, // 2 hours default
  originalPrice = 14990,
  discountedPrice,
  discountPercent = 20,
  className,
  variant = "banner",
  onExpire
}: CountdownOfferProps) => {
  // Calculate discounted price if not provided
  const finalDiscountedPrice = discountedPrice || Math.round(originalPrice * (1 - discountPercent / 100));
  const savings = originalPrice - finalDiscountedPrice;

  // Get or set expiry time in localStorage
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const stored = localStorage.getItem('implantx_offer_expiry');
    if (stored) {
      const expiry = parseInt(stored);
      const remaining = expiry - Date.now();
      if (remaining > 0) return Math.floor(remaining / 1000);
    }
    // Set new expiry
    const newExpiry = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem('implantx_offer_expiry', newExpiry.toString());
    return durationMinutes * 60;
  });

  const [isUrgent, setIsUrgent] = useState(false);
  const [viewersCount, setViewersCount] = useState(Math.floor(Math.random() * 12) + 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Update viewers occasionally
    const viewersTimer = setInterval(() => {
      setViewersCount(prev => Math.max(5, Math.min(25, prev + Math.floor(Math.random() * 5) - 2)));
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(viewersTimer);
    };
  }, [onExpire]);

  // Set urgent when less than 30 minutes
  useEffect(() => {
    setIsUrgent(timeLeft < 1800);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (timeLeft <= 0) return null;

  if (variant === "floating") {
    return (
      <div className={cn(
        "fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80",
        "bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 shadow-2xl",
        "animate-fade-in",
        className
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm">OFERTA ESPECIAL</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <Users className="w-3.5 h-3.5" />
            {viewersCount} viendo
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${finalDiscountedPrice.toLocaleString('es-CL')}</span>
              <span className="text-sm line-through text-white/60">${originalPrice.toLocaleString('es-CL')}</span>
            </div>
            <p className="text-xs text-white/80">Ahorras ${savings.toLocaleString('es-CL')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 uppercase">Expira en</p>
            <p className={cn(
              "text-xl font-mono font-bold",
              isUrgent && "animate-pulse text-yellow-300"
            )}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn(
        "flex items-center justify-between p-3 rounded-xl",
        "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20",
        "border border-amber-500/30",
        className
      )}>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium">
            <span className="text-red-500 font-bold">{discountPercent}% OFF</span>
            {" "}por tiempo limitado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className={cn("w-4 h-4", isUrgent ? "text-red-500 animate-pulse" : "text-amber-500")} />
          <span className={cn(
            "font-mono font-bold",
            isUrgent ? "text-red-500" : "text-foreground"
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    );
  }

  // Default: banner
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500",
      "p-[2px]",
      className
    )}>
      <div className="bg-background rounded-2xl p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Flame className="w-6 h-6 text-orange-500" />
              <div className="absolute inset-0 bg-orange-500/50 blur-md animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-foreground">OFERTA POR TIEMPO LIMITADO</p>
              <p className="text-xs text-muted-foreground">Solo para nuevos usuarios</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
            <Users className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-medium text-red-600">{viewersCount} viendo ahora</span>
          </div>
        </div>

        {/* Countdown and price */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">${finalDiscountedPrice.toLocaleString('es-CL')}</span>
              <span className="text-lg line-through text-muted-foreground">${originalPrice.toLocaleString('es-CL')}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 text-green-600 text-xs font-bold">
              <Zap className="w-3 h-3" />
              Ahorras ${savings.toLocaleString('es-CL')} CLP
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expira en:</p>
            <div className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg font-mono text-2xl font-bold",
              isUrgent 
                ? "bg-red-500/20 text-red-500 animate-pulse" 
                : "bg-amber-500/20 text-amber-600"
            )}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Urgency message */}
        <p className="text-center text-xs text-muted-foreground">
          ⚡ Esta oferta no volverá a repetirse • Garantía de devolución de 7 días
        </p>
      </div>
    </div>
  );
};

export default CountdownOffer;
