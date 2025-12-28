import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Download, FileText, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logoImplantX from "@/assets/logo-implantx-full.png";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const patientName = searchParams.get("name") || "Paciente";

  useEffect(() => {
    // Auto-generate report on successful payment
    if (status === "approved" && !pdfUrl) {
      handleGenerateReport();
    }
  }, [status]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-pdf-report", {
        body: {
          patientName,
          paymentId,
          reportType: "premium"
        }
      });

      if (error) throw error;

      if (data?.pdfUrl) {
        setPdfUrl(data.pdfUrl);
        toast({
          title: "¡Informe generado!",
          description: "Tu informe premium está listo para descargar.",
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error al generar informe",
        description: "Por favor intenta nuevamente o contacta soporte.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative max-w-lg w-full p-8 bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logoImplantX} alt="ImplantX" className="h-12" />
        </div>

        {/* Success animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-muted-foreground">
            Gracias por tu compra, <span className="font-semibold text-primary">{patientName}</span>
          </p>
          {paymentId && (
            <p className="text-xs text-muted-foreground mt-2">
              ID de transacción: {paymentId}
            </p>
          )}
        </div>

        {/* Report download section */}
        <div className="bg-primary/5 rounded-xl p-6 mb-6 border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 rounded-lg p-2">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Informe Premium</h3>
              <p className="text-sm text-muted-foreground">Análisis completo personalizado</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 ml-auto" />
          </div>

          <Button
            onClick={pdfUrl ? handleDownload : handleGenerateReport}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generando informe...
              </>
            ) : pdfUrl ? (
              <>
                <Download className="w-5 h-5 mr-2" />
                Descargar Informe PDF
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Generar mi Informe
              </>
            )}
          </Button>
        </div>

        {/* What's included */}
        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium text-foreground">Tu informe incluye:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Análisis de riesgo personalizado
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Pronóstico de éxito del implante
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Recomendaciones del especialista
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Plan de tratamiento sugerido
            </li>
          </ul>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
      </Card>

      {/* Support text */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Tienes problemas? Escríbenos a{" "}
        <a href="mailto:soporte@implantx.cl" className="text-primary hover:underline">
          soporte@implantx.cl
        </a>
      </p>
    </div>
  );
};

export default PaymentSuccess;
