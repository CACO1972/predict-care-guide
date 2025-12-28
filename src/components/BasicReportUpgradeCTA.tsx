import { Crown, CreditCard, Sparkles, Book, ImageIcon, CheckCircle2 } from "lucide-react";
import MercadoPagoButton from "./MercadoPagoButton";
import { MERCADOPAGO_PREFERENCES, REPORT_PRICES } from "@/types/reportLevels";

interface BasicReportUpgradeCTAProps {
  uploadedImage?: string | null;
}

const BasicReportUpgradeCTA = ({ uploadedImage }: BasicReportUpgradeCTAProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  const additionalCost = REPORT_PRICES.premium - REPORT_PRICES.basic;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-background p-6 shadow-xl shadow-amber-500/10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative space-y-4">
        {/* Badge */}
        <div className="absolute -top-1 -right-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-bl-lg rounded-tr-xl">
          UPGRADE
        </div>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground">Mejora a Premium</h4>
            <p className="text-xs text-muted-foreground">
              Añade funciones exclusivas a tu informe
            </p>
          </div>
        </div>

        {/* Características adicionales */}
        <div className="bg-background/50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground">Con Premium obtienes además:</p>
          <div className="grid gap-2">
            {[
              { icon: ImageIcon, text: "Simulación de Sonrisa con IA", highlight: true },
              { icon: Book, text: "Ebook: Todo sobre implantes dentales", highlight: true },
              { icon: CheckCircle2, text: "Análisis detallado de tu caso" },
              { icon: CheckCircle2, text: "Plan de tratamiento paso a paso" },
              { icon: CheckCircle2, text: "Estimación de costos reales" },
              { icon: CheckCircle2, text: "Consulta prioritaria con especialista" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 ${item.highlight ? 'p-2 rounded-lg bg-amber-500/10' : ''}`}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.highlight ? 'text-amber-500' : 'text-primary'}`} />
                <span className={`text-sm ${item.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {item.text}
                </span>
                {item.highlight && (
                  <span className="ml-auto px-1.5 py-0.5 bg-amber-500/20 text-amber-600 text-[9px] font-bold rounded">
                    NUEVO
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vista previa de simulación si hay imagen */}
        {uploadedImage && (
          <div className="bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-lg p-3 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                <img src={uploadedImage} alt="Tu imagen" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Tu imagen está lista</p>
                <p className="text-[10px] text-muted-foreground">
                  Con Premium verás cómo lucirá tu nueva sonrisa
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        )}

        {/* Precio y CTA */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Solo añade</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-amber-600">+${formatPrice(additionalCost)}</span>
              <span className="text-sm text-muted-foreground">CLP</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: ${formatPrice(REPORT_PRICES.premium)} CLP
            </p>
          </div>
          
          <MercadoPagoButton preferenceId={MERCADOPAGO_PREFERENCES.premium} />
          
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <CreditCard className="w-3 h-3" />
            Hasta 3 cuotas sin interés
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicReportUpgradeCTA;
