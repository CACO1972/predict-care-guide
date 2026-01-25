// Tipos para los tres niveles de informe

export type ReportLevel = 'free' | 'basic' | 'premium';

export interface IRPData {
  score: number;
  riskLevel: 'Alto' | 'Moderado' | 'Bajo';
  interpretation: string;
  advice: string;
  gumBleeding: 'never' | 'sometimes' | 'frequently';
  looseTeethLoss: 'no' | '1-2' | 'several';
  oralHygiene: 'less-once' | 'once' | 'twice-plus';
}

export interface ReportSections {
  // Informe Gratuito (siempre visible)
  header: boolean;
  successRange: boolean;
  irpSection: boolean;
  importantNote: boolean;
  freeUpgradeCTA: boolean;
  
  // Informe Básico ($14.900) - todo lo anterior más:
  improvementPotential: boolean;
  actionsList: boolean;
  riskFactorBars: boolean;
  recommendations: boolean;
  nextSteps: boolean;
  basicUpgradeCTA: boolean;
  
  // Informe Premium ($29.990) - todo lo anterior más:
  smileSimulation: boolean;
  detailedAnalysis: boolean;
  treatmentTimeline: boolean;
  costEstimation: boolean;
  priorityConsultation: boolean;
  ebook: boolean;
  synergyFactors: boolean;
  whatIfSimulator: boolean;
  imageAnalysis: boolean;
}

// Función para obtener las secciones visibles según el nivel de informe
export const getVisibleSections = (level: ReportLevel): ReportSections => {
  const freeSections: ReportSections = {
    // Gratuito
    header: true,
    successRange: true,
    irpSection: true,
    importantNote: true,
    freeUpgradeCTA: true,
    // Básico
    improvementPotential: false,
    actionsList: false,
    riskFactorBars: false,
    recommendations: false,
    nextSteps: false,
    basicUpgradeCTA: false,
    // Premium
    smileSimulation: false,
    detailedAnalysis: false,
    treatmentTimeline: false,
    costEstimation: false,
    priorityConsultation: false,
    ebook: false,
    synergyFactors: false,
    whatIfSimulator: false,
    imageAnalysis: false,
  };

  const basicSections: ReportSections = {
    // Gratuito
    header: true,
    successRange: true,
    irpSection: true,
    importantNote: true,
    freeUpgradeCTA: false,
    // Básico
    improvementPotential: true,
    actionsList: true,
    riskFactorBars: true,
    recommendations: true,
    nextSteps: true,
    basicUpgradeCTA: true,
    // Premium
    smileSimulation: false,
    detailedAnalysis: false,
    treatmentTimeline: false,
    costEstimation: false,
    priorityConsultation: false,
    ebook: false,
    synergyFactors: false,
    whatIfSimulator: false,
    imageAnalysis: false,
  };

  const premiumSections: ReportSections = {
    // Gratuito
    header: true,
    successRange: true,
    irpSection: true,
    importantNote: true,
    freeUpgradeCTA: false,
    // Básico
    improvementPotential: true,
    actionsList: true,
    riskFactorBars: true,
    recommendations: true,
    nextSteps: true,
    basicUpgradeCTA: false,
    // Premium
    smileSimulation: true,
    detailedAnalysis: true,
    treatmentTimeline: true,
    costEstimation: true,
    priorityConsultation: true,
    ebook: true,
    synergyFactors: true,
    whatIfSimulator: true,
    imageAnalysis: true,
  };

  switch (level) {
    case 'free':
      return freeSections;
    case 'basic':
      return basicSections;
    case 'premium':
      return premiumSections;
    default:
      return freeSections;
  }
};

// Precios en CLP
export const REPORT_PRICES = {
  free: 0,
  basic: 14900,
  premium: 29990,
} as const;

// IDs de preferencia de MercadoPago (placeholder - se deben configurar los reales)
export const MERCADOPAGO_PREFERENCES = {
  basic: '130000413-17acabf6-744b-41e6-be85-2488b518c274',
  premium: '130000413-5c54f887-998b-451f-9d14-21d8a1822264',
  upgrade: '130000413-c1e3a2b4-567d-489e-bc12-3456789abcde', // Upgrade from basic to premium
} as const;
