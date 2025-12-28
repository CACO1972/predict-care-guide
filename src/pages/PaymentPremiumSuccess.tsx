import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, Crown, Sparkles, Camera, 
  MapPin, ArrowRight, Loader2, Mail, Upload
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const PaymentPremiumSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'questions' | 'email' | 'done'>('questions');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
  
  // Recuperar datos del localStorage si viene de upgrade
  const [patientData, setPatientData] = useState({
    patientName: "Paciente",
    email: ""
  });

  useEffect(() => {
    const savedData = localStorage.getItem('implantx_upgrade_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPatientData({
        patientName: parsed.patientName || "Paciente",
        email: parsed.email || ""
      });
      setUserEmail(parsed.email || "");
    }
    
    const nameParam = searchParams.get("name");
    const emailParam = searchParams.get("email");
    if (nameParam) setPatientData(prev => ({ ...prev, patientName: nameParam }));
    if (emailParam) {
      setPatientData(prev => ({ ...prev, email: emailParam }));
      setUserEmail(emailParam);
    }
  }, [searchParams]);

  const zones = [
    { id: 'max-frontal', label: 'Maxilar Superior - Frontal', icon: '🦷' },
    { id: 'max-posterior', label: 'Maxilar Superior - Posterior', icon: '🦷' },
    { id: 'mand-frontal', label: 'Maxilar Inferior - Frontal', icon: '🦷' },
    { id: 'mand-posterior', label: 'Maxilar Inferior - Posterior', icon: '🦷' },
  ];

  const toggleZone = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(z => z !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast.success("Imagen subida correctamente");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinueToEmail = () => {
    if (selectedZones.length === 0) {
      toast.error("Selecciona al menos una zona donde te faltan dientes");
      return;
    }
    setStep('email');
  };

  const handleSendPremiumReport = async () => {
    if (!userEmail) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    setIsLoading(true);
    try {
      // Guardar lead con tier 'premium'
      const { error: leadError } = await supabase.from('leads').insert({
        email: userEmail,
        phone: '',
        patient_name: patientData.patientName,
        source: 'payment_premium'
      });

      if (leadError) {
        console.error('Error saving lead:', leadError);
      }

      // Enviar email con informe premium
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          email: userEmail,
          patientName: patientData.patientName,
          reportLevel: 'premium',
          paymentId,
          premiumData: {
            uploadedImage,
            selectedZones
          }
        }
      });

      if (error) throw error;

      setStep('done');
      toast.success("¡Informe Premium enviado!");
      
      // Limpiar localStorage
      localStorage.removeItem('implantx_upgrade_data');
    } catch (err) {
      console.error('Error sending premium report:', err);
      toast.error("Error al enviar el informe", {
        description: "Intenta nuevamente"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step: Done
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-amber-500/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-2 border-amber-500/30">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ¡Informe Premium Enviado! 👑
            </h1>
            <p className="text-muted-foreground">
              Hemos enviado tu Informe Premium completo a <strong className="text-foreground">{userEmail}</strong>
            </p>
          </div>
          <div className="bg-amber-500/10 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-foreground">Tu informe incluye:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Simulación de sonrisa personalizada
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Estimación de costos detallada
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Plan de tratamiento completo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Ebook sobre implantes dentales
              </li>
            </ul>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-110"
          >
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  // Step: Email
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-amber-500/5 to-background p-4">
        <div className="max-w-lg mx-auto pt-8 pb-12 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">INFORME PREMIUM</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              ¿A dónde enviamos tu informe?
            </h1>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tu correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-12 h-12"
                />
              </div>
            </div>

            <Button
              onClick={handleSendPremiumReport}
              disabled={isLoading || !userEmail}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-110"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando informe...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Enviar mi Informe Premium
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Step: Questions (Premium only)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-amber-500/5 to-background p-4">
      <div className="max-w-lg mx-auto pt-8 pb-12 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center animate-pulse">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              ¡Bienvenido al Plan Premium! 👑
            </h1>
            <p className="text-muted-foreground mt-2">
              Solo necesitamos unos datos más para personalizar tu informe
            </p>
          </div>
        </div>

        {/* Question 1: Selfie */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Sube una foto de tu boca (opcional)
              </h3>
              <p className="text-xs text-muted-foreground">
                Para generar tu simulación de sonrisa con IA
              </p>
            </div>
          </div>

          {uploadedImage ? (
            <div className="relative rounded-xl overflow-hidden border border-primary/30">
              <img 
                src={uploadedImage} 
                alt="Tu foto" 
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setUploadedImage(null)}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Toca para subir una selfie de tu sonrisa
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  JPG, PNG hasta 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </Card>

        {/* Question 2: Zones */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                ¿En qué zona te faltan dientes?
              </h3>
              <p className="text-xs text-muted-foreground">
                Puedes seleccionar más de una opción
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => toggleZone(zone.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  selectedZones.includes(zone.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-2xl mb-2 block">{zone.icon}</span>
                <span className="text-sm font-medium text-foreground block">
                  {zone.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handleContinueToEmail}
          disabled={selectedZones.length === 0}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-110"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {paymentId && (
          <p className="text-xs text-center text-muted-foreground">
            ID de pago: {paymentId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentPremiumSuccess;
