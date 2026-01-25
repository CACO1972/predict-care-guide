import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Gift, Clock, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import MercadoPagoButton from "./MercadoPagoButton";

interface ExitIntentPopupProps {
  isEnabled?: boolean;
  patientName?: string;
  irpScore?: number;
}

const ExitIntentPopup = ({ isEnabled = true, patientName, irpScore }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Exit intent detection
  useEffect(() => {
    if (!isEnabled || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Mobile: detect scroll up quickly (likely leaving)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollY - currentScrollY;
      
      // If scrolling up quickly from below 200px
      if (scrollDiff > 50 && currentScrollY < 100 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
      lastScrollY = currentScrollY;
    };

    // Add delay before enabling exit intent
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 5000); // Wait 5 seconds before enabling

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isEnabled, hasShown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const discountedPrice = 11990; // 20% off from 14990
  const originalPrice = 14990;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-primary/50">
        {/* Header with urgency */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              ¡ESPERA!
            </div>
            <h3 className="text-xl font-bold">
              {patientName ? `${patientName}, no te vayas aún` : "No te vayas aún"}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Exclusive offer */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary">OFERTA EXCLUSIVA</span>
            </div>
            
            <p className="text-foreground">
              Llévate tu <strong>Plan de Acción Completo</strong> con <span className="text-red-500 font-bold">20% de descuento</span>
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-sm font-medium">Esta oferta expira en:</span>
            </div>
            <div className="text-3xl font-mono font-bold text-red-500">
              {formatTime(countdown)}
            </div>
          </div>

          {/* Price comparison */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-muted-foreground line-through">${originalPrice.toLocaleString('es-CL')}</span>
              <span className="text-4xl font-bold text-primary">${discountedPrice.toLocaleString('es-CL')}</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-sm font-bold">
              Ahorras ${(originalPrice - discountedPrice).toLocaleString('es-CL')}
            </div>
          </div>

          {/* What's included */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Incluye:</p>
            <div className="grid gap-1.5">
              {[
                "Análisis completo de factores de riesgo",
                "Tu potencial de mejora personalizado",
                "Plan de acción paso a paso",
                "Recomendaciones de especialistas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <MercadoPagoButton 
              tier="basic"
              className="!bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              No gracias, prefiero pagar precio completo después
            </button>
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Garantía de satisfacción 100% o te devolvemos tu dinero</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
