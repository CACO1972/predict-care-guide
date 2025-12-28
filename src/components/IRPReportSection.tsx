import { AlertCircle, Lightbulb, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IRPData } from "@/types/reportLevels";

interface IRPReportSectionProps {
  irpData: IRPData;
  patientName?: string;
}

const IRPReportSection = ({ irpData, patientName }: IRPReportSectionProps) => {
  const { score, riskLevel, interpretation, advice } = irpData;

  const getRiskColor = () => {
    if (score <= 40) return { text: 'text-red-500', bg: 'bg-red-500', bgLight: 'bg-red-500/10' };
    if (score <= 70) return { text: 'text-amber-500', bg: 'bg-amber-500', bgLight: 'bg-amber-500/10' };
    return { text: 'text-emerald-500', bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10' };
  };

  const getRiskIcon = () => {
    if (score <= 40) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (score <= 70) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  };

  const colors = getRiskColor();

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Tu Índice de Riesgo Periodontal (IRP)</h4>
          <p className="text-xs text-muted-foreground">Evaluación de la salud de tus encías</p>
        </div>
      </div>

      {/* Score visual */}
      <div className="bg-background/50 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-center gap-6">
          {/* Círculo de score */}
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score / 100) * 301} 301`}
                strokeLinecap="round"
                className={cn("transition-all duration-1000 ease-out", colors.text)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold", colors.text)}>{score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Nivel de riesgo */}
          <div className="text-left">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2",
              colors.bgLight
            )}>
              {getRiskIcon()}
              <span className={cn("font-semibold text-sm", colors.text)}>
                {riskLevel === 'Alto' ? 'Riesgo Alto' : riskLevel === 'Moderado' ? 'Riesgo Moderado' : 'Riesgo Bajo'}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Alto Riesgo</span>
            <span>Bajo Riesgo</span>
          </div>
          <div className="relative h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 overflow-hidden">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-foreground rounded-full shadow-md transition-all duration-1000"
              style={{ left: `calc(${score}% - 6px)` }}
            />
          </div>
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
        <p className="text-xs font-semibold text-foreground">Interpretación:</p>
        <p className="text-sm text-muted-foreground">{interpretation}</p>
      </div>

      {/* Consejo personalizado */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-primary">Consejo de Río:</p>
        </div>
        <p className="text-sm text-foreground/80">{advice}</p>
      </div>
    </div>
  );
};

export default IRPReportSection;
