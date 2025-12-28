import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, FileText, CreditCard } from "lucide-react";
import RioAvatar from "@/components/RioAvatar";
import { cn } from "@/lib/utils";

interface IRPResultScreenProps {
  gumBleeding: 'never' | 'sometimes' | 'frequently';
  looseTeethLoss: 'no' | '1-2' | 'several';
  oralHygiene: 'less-once' | 'once' | 'twice-plus';
  patientName?: string;
  onPaymentClick: () => void;
  onFreeReportClick: () => void;
}

// Función para calcular el IRP (Índice de Riesgo Periodontal)
const calculateIRP = (
  gumBleeding: string,
  looseTeethLoss: string,
  oralHygiene: string
): number => {
  let score = 100;

  // Sangrado de encías
  if (gumBleeding === 'frequently') score -= 35;
  else if (gumBleeding === 'sometimes') score -= 15;

  // Dientes sueltos perdidos
  if (looseTeethLoss === 'several') score -= 40;
  else if (looseTeethLoss === '1-2') score -= 25;

  // Higiene oral
  if (oralHygiene === 'less-once') score -= 30;
  else if (oralHygiene === 'once') score -= 15;

  return Math.max(0, score);
};

// Función para determinar el nivel de riesgo
const getRiskLevel = (score: number): { level: string; color: string; bgColor: string; icon: React.ReactNode } => {
  if (score <= 40) {
    return {
      level: 'Riesgo Alto',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      icon: <AlertCircle className="w-6 h-6 text-red-500" />
    };
  } else if (score <= 70) {
    return {
      level: 'Riesgo Moderado',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
    };
  } else {
    return {
      level: 'Riesgo Bajo',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    };
  }
};

// Función para obtener la interpretación
const getInterpretation = (score: number): string => {
  if (score <= 40) {
    return "Tus encías necesitan atención urgente antes de cualquier procedimiento dental para asegurar el éxito a largo plazo.";
  } else if (score <= 70) {
    return "Tus encías necesitan atención antes de un procedimiento para asegurar el éxito a largo plazo.";
  } else {
    return "Tus encías están en buen estado. Tienes buenas condiciones para un tratamiento exitoso.";
  }
};

// Función para obtener consejo personalizado
const getPersonalizedAdvice = (
  gumBleeding: string,
  looseTeethLoss: string,
  oralHygiene: string
): string => {
  // Priorizar el consejo basado en el factor más crítico
  if (looseTeethLoss === 'several') {
    return "La pérdida de varios dientes por movilidad indica una condición periodontal avanzada. Una evaluación profesional urgente es esencial antes de cualquier tratamiento.";
  }
  if (gumBleeding === 'frequently') {
    return "El sangrado frecuente indica inflamación activa en tus encías. Considera una limpieza profesional y mejora tu rutina de cepillado.";
  }
  if (oralHygiene === 'less-once') {
    return "Cepillarte al menos dos veces al día es fundamental. Esto solo puede mejorar significativamente la salud de tus encías en pocas semanas.";
  }
  if (looseTeethLoss === '1-2') {
    return "Haber perdido dientes por movilidad sugiere problemas periodontales previos. Es importante estabilizar tu salud bucal antes del implante.";
  }
  if (gumBleeding === 'sometimes') {
    return "Tu sangrado ocasional sugiere inflamación leve. Intenta usar hilo dental una vez al día durante una semana y notarás la diferencia.";
  }
  if (oralHygiene === 'once') {
    return "Añadir un segundo cepillado al día, especialmente antes de dormir, mejorará notablemente la salud de tus encías.";
  }
  return "Mantén tus buenos hábitos de higiene oral. Estás en el camino correcto para un tratamiento exitoso.";
};

const IRPResultScreen = ({
  gumBleeding,
  looseTeethLoss,
  oralHygiene,
  patientName = "Paciente",
  onPaymentClick,
  onFreeReportClick
}: IRPResultScreenProps) => {
  const score = calculateIRP(gumBleeding, looseTeethLoss, oralHygiene);
  const riskInfo = getRiskLevel(score);
  const interpretation = getInterpretation(score);
  const advice = getPersonalizedAdvice(gumBleeding, looseTeethLoss, oralHygiene);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Título principal */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Análisis Completado</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          ¡Hemos analizado la salud de tu boca!
        </h2>
      </div>

      {/* Card de resultado principal */}
      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Score visual */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            Tu Índice de Riesgo Periodontal (IRP)
          </p>
          
          {/* Círculo de progreso */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 440} 440`}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score <= 40 ? "text-red-500" : score <= 70 ? "text-amber-500" : "text-emerald-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-4xl font-bold", riskInfo.color)}>{score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Nivel de riesgo */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            score <= 40 ? "bg-red-500/10" : score <= 70 ? "bg-amber-500/10" : "bg-emerald-500/10"
          )}>
            {riskInfo.icon}
            <span className={cn("font-semibold", riskInfo.color)}>{riskInfo.level}</span>
          </div>
        </div>

        {/* Barra de progreso alternativa */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Alto Riesgo</span>
            <span>Bajo Riesgo</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 overflow-hidden">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-foreground rounded-full shadow-md transition-all duration-1000"
              style={{ left: `calc(${score}% - 8px)` }}
            />
          </div>
        </div>

        {/* Interpretación */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Interpretación:</p>
          <p className="text-sm text-muted-foreground">{interpretation}</p>
        </div>

        {/* Consejo personalizado */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-primary">Consejo de Río:</p>
          </div>
          <p className="text-sm text-foreground/80">{advice}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón principal - Pago */}
        <Button
          onClick={onPaymentClick}
          className="w-full h-14 text-base font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all group"
          size="lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Obtener mi Plan de Acción Completo por $14.900
        </Button>

        {/* Botón secundario - Gratis */}
        <Button
          onClick={onFreeReportClick}
          variant="ghost"
          className="w-full h-12 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <FileText className="w-4 h-4 mr-2" />
          Solo quiero mi informe IRP gratis por ahora
        </Button>
      </div>

      {/* Nota de confianza */}
      <p className="text-xs text-center text-muted-foreground/60">
        Pago seguro con MercadoPago. Tu información está protegida.
      </p>
    </div>
  );
};

export default IRPResultScreen;
