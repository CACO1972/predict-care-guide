import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Crown, Book, Sparkles, Download, Loader2, 
  CheckCircle2, CreditCard, Lock, ImageIcon, Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UrgencyCounter from "./UrgencyCounter";
import MercadoPagoButton from "./MercadoPagoButton";
interface PremiumReportSectionProps {
  patientName?: string;
  uploadedImage?: string | null;
  pronosticoLabel?: string;
}

const PremiumReportSection = ({ 
  patientName, 
  uploadedImage, 
  pronosticoLabel 
}: PremiumReportSectionProps) => {
  const [isGeneratingSimulation, setIsGeneratingSimulation] = useState(false);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const handleGenerateSimulation = async () => {
    if (!uploadedImage) {
      toast.error("No hay imagen disponible para la simulación");
      return;
    }

    setIsGeneratingSimulation(true);
    setSimulationError(null);

    try {
      const { data, error } = await supabase.functions.invoke('simulate-smile', {
        body: {
          imageUrl: uploadedImage,
          patientName,
          pronosticoLabel
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success && data.simulatedImageUrl) {
        setSimulatedImage(data.simulatedImageUrl);
        toast.success("¡Simulación generada exitosamente!");
      } else {
        throw new Error(data?.error || 'Error al generar simulación');
      }
    } catch (err) {
      console.error('Error generating simulation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setSimulationError(errorMessage);
      toast.error("No se pudo generar la simulación", {
        description: errorMessage
      });
    } finally {
      setIsGeneratingSimulation(false);
    }
  };

  const premiumFeatures = [
    {
      icon: Book,
      title: "Guía Completa del Paciente",
      description: "Ebook: \"Todo lo que debes saber antes de colocarte implantes\"",
      highlight: true
    },
    {
      icon: ImageIcon,
      title: "Simulación de Sonrisa con IA",
      description: "Visualiza cómo lucirá tu nueva sonrisa",
      highlight: true
    },
    {
      icon: CheckCircle2,
      title: "Análisis detallado de tu caso",
      description: "Evaluación profunda de factores clínicos"
    },
    {
      icon: CheckCircle2,
      title: "Plan de tratamiento paso a paso",
      description: "Timeline completo con tiempos estimados"
    },
    {
      icon: CheckCircle2,
      title: "Estimación de costos reales",
      description: "Rango de precios según tu caso"
    },
    {
      icon: CheckCircle2,
      title: "Consulta prioritaria",
      description: "Acceso preferente al especialista"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 space-y-5 shadow-xl shadow-primary/10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Header con branding */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
            <Crown className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h4 className="text-xl font-bold text-foreground">Reporte Premium</h4>
            <p className="text-sm text-muted-foreground">Análisis completo de tu caso</p>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid gap-3 mb-5">
          {premiumFeatures.map((feature, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-all",
                feature.highlight 
                  ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30" 
                  : "bg-muted/30"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                feature.highlight ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <feature.icon className="w-4 h-4" />
              </div>
              <div>
                <p className={cn(
                  "text-sm font-semibold",
                  feature.highlight ? "text-primary" : "text-foreground"
                )}>
                  {feature.title}
                </p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              {feature.highlight && (
                <span className="ml-auto px-2 py-0.5 bg-primary/30 text-primary text-[10px] font-bold rounded-full">
                  NUEVO
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Guía Interactiva de Implantes */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-primary/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Book className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-foreground">Guía Completa sobre Implantes Dentales</span>
          </div>
          <div className="rounded-lg overflow-hidden border border-border bg-background">
            <iframe 
              src="https://gamma.app/embed/krnbk9hgyfr0ypj" 
              style={{ width: '100%', height: '350px' }}
              allow="fullscreen" 
              title="Guía sobre Implantes Dentales para Pacientes"
              className="border-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            📖 Desliza para explorar la guía completa
          </p>
        </div>

        {/* Smile Simulation Preview */}
        {uploadedImage && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-primary/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-foreground">Vista Previa: Simulación de Sonrisa</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Original Image */}
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img 
                  src={uploadedImage} 
                  alt="Imagen original" 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded text-[10px] text-muted-foreground">
                  Tu imagen
                </div>
              </div>
              
              {/* Simulated or Locked Preview */}
              <div className="relative rounded-lg overflow-hidden border border-primary/30 bg-muted/50">
                {simulatedImage ? (
                  <>
                    <img 
                      src={simulatedImage} 
                      alt="Simulación de sonrisa" 
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary/80 backdrop-blur-sm rounded text-[10px] text-primary-foreground font-medium">
                      ¡Tu nueva sonrisa!
                    </div>
                  </>
                ) : (
                  <div className="w-full h-24 flex flex-col items-center justify-center">
                    {isGeneratingSimulation ? (
                      <>
                        <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                        <span className="text-[10px] text-muted-foreground">Generando...</span>
                      </>
                    ) : (
                      <>
                        <div className="blur-sm opacity-30 absolute inset-0 bg-gradient-to-br from-white to-primary/20" />
                        <Lock className="w-5 h-5 text-primary relative z-10 mb-1" />
                        <span className="text-[10px] text-muted-foreground relative z-10">Premium</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {simulationError && (
              <p className="text-xs text-destructive mt-2">{simulationError}</p>
            )}
          </div>
        )}
        
        {/* Urgency Counter */}
        <UrgencyCounter className="mb-4" />

        {/* Pricing Options */}
        <div className="space-y-4">
          {/* Plan Esencial - $14.990 */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-semibold text-foreground">Informe Esencial</h5>
                <p className="text-xs text-muted-foreground">Análisis básico + recomendaciones</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">$14.990</span>
                <span className="text-sm text-muted-foreground"> CLP</span>
              </div>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mb-3">
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Evaluación de riesgo personalizada</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Plan de tratamiento básico</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Guía de cuidados pre-implante</li>
            </ul>
            <MercadoPagoButton preferenceId="130000413-17acabf6-744b-41e6-be85-2488b518c274" />
          </div>

          {/* Plan Premium - $29.000 */}
          <div className="p-4 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-bl-lg">
              MÁS POPULAR
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-semibold text-foreground flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  Informe Premium
                </h5>
                <p className="text-xs text-muted-foreground">Análisis completo + simulación IA</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through">$49.990</span>
                <div>
                  <span className="text-2xl font-bold text-primary">$29.000</span>
                  <span className="text-sm text-muted-foreground"> CLP</span>
                </div>
              </div>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mb-3">
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Todo lo del plan Esencial</li>
              <li className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> Simulación de sonrisa con IA</li>
              <li className="flex items-center gap-1"><Book className="w-3 h-3 text-primary" /> Ebook completo sobre implantes</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Estimación de costos detallada</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Consulta prioritaria con especialista</li>
            </ul>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-3">
              <CreditCard className="w-3 h-3" />
              Hasta 3 cuotas sin interés
            </p>
            <MercadoPagoButton preferenceId="130000413-5c54f887-998b-451f-9d14-21d8a1822264" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReportSection;