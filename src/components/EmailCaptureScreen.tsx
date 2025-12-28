import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, FileText, Loader2, CheckCircle2 } from "lucide-react";
import RioAvatar from "@/components/RioAvatar";

interface EmailCaptureScreenProps {
  patientName?: string;
  irpScore: number;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const EmailCaptureScreen = ({
  patientName = "Paciente",
  irpScore,
  onSubmit,
  isLoading = false
}: EmailCaptureScreenProps) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(email);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RioAvatar 
        message={`${patientName}, te enviaré tu informe IRP gratuito por email. Solo necesito tu correo electrónico.`}
        userName={patientName}
      />

      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Título */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Tu Informe IRP Gratuito
          </h3>
          <p className="text-sm text-muted-foreground">
            Recibirás un PDF con tu puntaje ({irpScore}/100), interpretación y consejos básicos.
          </p>
        </div>

        {/* Qué incluye */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Tu informe incluye:</p>
          <ul className="space-y-2">
            {[
              "Tu puntaje IRP y nivel de riesgo",
              "Interpretación de tus resultados",
              "3 consejos básicos de cuidado",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Campo de email */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Tu correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="tu@email.com"
              className="pl-12 h-12 text-base rounded-xl border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-12 text-base font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Enviar mi Informe Gratis
            </>
          )}
        </Button>

        {/* Nota de privacidad */}
        <p className="text-xs text-center text-muted-foreground/60">
          No compartiremos tu email con terceros. Solo lo usaremos para enviarte tu informe.
        </p>
      </div>
    </div>
  );
};

export default EmailCaptureScreen;
