
// Define the window interface with gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: any) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics
export const initAnalytics = (measurementId: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  // @ts-ignore
  window.gtag = gtag;
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false // We'll manually track page views
  });
};

// Track page views
export const trackPageView = (url: string, title: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_location: url,
    page_title: title,
    page_path: new URL(url).pathname
  });
};

// Track events (e.g. button clicks, form submissions)
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, params);
};

// Track ecommerce events
export const trackAddToCart = (product: any) => {
  trackEvent('add_to_cart', {
    currency: 'MAD',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_brand: product.brand,
      quantity: 1
    }]
  });
};

export const trackPurchase = (orderId: string, products: any[], totalValue: number) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: totalValue,
    currency: 'MAD',
    tax: 0,
    shipping: 0,
    items: products.map(product => ({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_brand: product.brand,
      quantity: product.quantity || 1
    }))
  });
};

// Track core web vitals
export const trackWebVitals = () => {
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      getCLS(metric => {
        trackEvent('web_vitals', {
          metric_name: 'CLS',
          metric_value: metric.value,
          metric_rating: metric.rating
        });
      });
      getFID(metric => {
        trackEvent('web_vitals', {
          metric_name: 'FID',
          metric_value: metric.value,
          metric_rating: metric.rating
        });
      });
      getLCP(metric => {
        trackEvent('web_vitals', {
          metric_name: 'LCP',
          metric_value: metric.value,
          metric_rating: metric.rating
        });
      });
      getFCP(metric => {
        trackEvent('web_vitals', {
          metric_name: 'FCP',
          metric_value: metric.value,
        });
      });
      getTTFB(metric => {
        trackEvent('web_vitals', {
          metric_name: 'TTFB',
          metric_value: metric.value,
        });
      });
    });
  }
};
