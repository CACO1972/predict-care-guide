import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, Crown, Sparkles, CreditCard, 
  FileText, ArrowRight, Loader2, Mail
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { REPORT_PRICES } from "@/types/reportLevels";
import MercadoPagoButton from "@/components/MercadoPagoButton";

const PaymentBasicSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
  const patientName = searchParams.get("name") || "Paciente";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }
  }, [email]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  const additionalCost = REPORT_PRICES.premium - REPORT_PRICES.basic;

  // Handler para generar y enviar el informe básico
  const handleGenerateBasicReport = async () => {
    if (!userEmail) {
      toast.error("Por favor ingresa tu email para recibir el informe");
      return;
    }

    setIsLoading(true);
    try {
      // Guardar lead con tier 'basic'
      const { error: leadError } = await supabase.from('leads').insert({
        email: userEmail,
        phone: '',
        patient_name: patientName,
        source: 'payment_basic'
      });

      if (leadError) {
        console.error('Error saving lead:', leadError);
      }

      // Enviar email con informe básico
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          email: userEmail,
          patientName,
          reportLevel: 'basic',
          paymentId
        }
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("¡Informe enviado!", {
        description: "Revisa tu correo electrónico"
      });
    } catch (err) {
      console.error('Error sending report:', err);
      toast.error("Error al enviar el informe", {
        description: "Intenta nuevamente"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para upgrade a premium
  const handleUpgradeToPremium = () => {
    // Guardar datos en localStorage para después del pago premium
    localStorage.setItem('implantx_upgrade_data', JSON.stringify({
      patientName,
      email: userEmail,
      fromBasic: true
    }));
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ¡Informe Enviado!
            </h1>
            <p className="text-muted-foreground">
              Hemos enviado tu Plan de Acción ImplantX a <strong className="text-foreground">{userEmail}</strong>
            </p>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 text-left">
            <p className="text-sm text-muted-foreground">
              Revisa tu bandeja de entrada (y la carpeta de spam por si acaso). 
              El PDF incluye tu evaluación completa y recomendaciones personalizadas.
            </p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="max-w-lg mx-auto pt-8 pb-12 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              ¡Gracias por tu compra! 🎉
            </h1>
            <p className="text-muted-foreground mt-2">
              Tu Plan de Acción está listo, {patientName}
            </p>
          </div>
        </div>

        {/* Upgrade Offer Card */}
        <Card className="relative overflow-hidden border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background p-6 shadow-xl">
          {/* Badge */}
          <div className="absolute -top-1 -right-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-bl-lg">
            OFERTA EXCLUSIVA
          </div>

          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  ¿Quieres llevarlo al máximo?
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upgrade exclusivo post-compra
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-background/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                Con el Informe Premium obtienes:
              </p>
              <div className="grid gap-2">
                {[
                  { icon: Sparkles, text: "Simulación de Sonrisa con IA", highlight: true },
                  { icon: FileText, text: "Estimación de costos detallada", highlight: true },
                  { icon: CheckCircle2, text: "Análisis completo de tu caso" },
                  { icon: CheckCircle2, text: "Plan paso a paso personalizado" },
                  { icon: CheckCircle2, text: "Ebook completo sobre implantes" },
                  { icon: CheckCircle2, text: "Consulta prioritaria con especialista" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${item.highlight ? 'p-2 rounded-lg bg-amber-500/10' : ''}`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${item.highlight ? 'text-amber-500' : 'text-primary'}`} />
                    <span className={`text-sm ${item.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="text-center py-2">
              <p className="text-xs text-muted-foreground mb-1">Solo añade</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-amber-600">
                  +${formatPrice(additionalCost)}
                </span>
                <span className="text-sm text-muted-foreground">CLP</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total: ${formatPrice(REPORT_PRICES.premium)} CLP
              </p>
            </div>

            {/* Upgrade Button */}
            <div onClick={handleUpgradeToPremium}>
              <MercadoPagoButton 
                preferenceId="130000413-upgrade-premium"
              />
            </div>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <CreditCard className="w-3 h-3" />
              Hasta 3 cuotas sin interés
            </p>
          </div>
        </Card>

        {/* Decline Upgrade - Get Basic Report */}
        <Card className="p-6 space-y-4 border border-border">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">
              ¿Prefieres solo tu Plan de Acción de $14.900?
            </h3>
            <p className="text-sm text-muted-foreground">
              Ingresa tu email para recibir tu informe básico
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 h-12 text-base rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all"
              />
            </div>
            
            <Button
              onClick={handleGenerateBasicReport}
              disabled={isLoading || !userEmail}
              variant="outline"
              className="w-full h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar mi Plan de Acción de $14.900
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Payment confirmation */}
        {paymentId && (
          <p className="text-xs text-center text-muted-foreground">
            ID de pago: {paymentId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentBasicSuccess;
