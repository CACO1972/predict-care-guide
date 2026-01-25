// Meta Pixel utility for tracking conversions
// Pixel ID: Clinica Miró

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const META_PIXEL_ID = '235200739426022';

// Initialize Meta Pixel (called once on app load)
export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (window.fbq) return;

  const n = (window.fbq = function (...args: unknown[]) {
    if ((n as any).callMethod) {
      (n as any).callMethod.apply(n, args);
    } else {
      (n as any).queue.push(args);
    }
  }) as any;
  
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  // Load the Facebook Pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // Initialize with Pixel ID
  window.fbq('init', META_PIXEL_ID);
  
  console.log('[Meta Pixel] Initialized with ID:', META_PIXEL_ID);
};

// Track PageView - called on route changes
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
    console.log('[Meta Pixel] PageView tracked');
  }
};

// Track Lead - when user completes questionnaire and provides contact info
export const trackLead = (data?: { 
  content_name?: string; 
  value?: number; 
  currency?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data?.content_name || 'ImplantX Questionnaire',
      value: data?.value || 0,
      currency: data?.currency || 'CLP',
    });
    console.log('[Meta Pixel] Lead tracked', data);
  }
};

// Track InitiateCheckout - when user clicks to pay
export const trackInitiateCheckout = (data: {
  value: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  num_items?: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: data.value,
      currency: data.currency || 'CLP',
      content_name: data.content_name || 'Informe ImplantX',
      content_ids: data.content_ids || ['implantx-report'],
      num_items: data.num_items || 1,
    });
    console.log('[Meta Pixel] InitiateCheckout tracked', data);
  }
};

// Track Purchase - when payment is successful
export const trackPurchase = (data: {
  value: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  transaction_id?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: data.value,
      currency: data.currency || 'CLP',
      content_name: data.content_name || 'Informe ImplantX',
      content_ids: data.content_ids || ['implantx-report'],
      content_type: data.content_type || 'product',
      transaction_id: data.transaction_id,
    });
    console.log('[Meta Pixel] Purchase tracked', data);
  }
};

// Track custom events
export const trackCustomEvent = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data);
    console.log('[Meta Pixel] Custom event tracked:', eventName, data);
  }
};
