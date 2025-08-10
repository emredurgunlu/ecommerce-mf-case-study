// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'host-app',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  PORT: process.env.NEXT_PUBLIC_PORT || 3000,
  HOST_URL:process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3001',
  BASE_URL:process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com'
}

// Remote Apps Configuration
export const REMOTE_APPS = {
  PRODUCTS: {
    NAME: 'products-remote',
    URL: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PRODUCTS_URL || 'https://ecommerce-mf-case-study-products-re.vercel.app'
      : 'http://localhost:3001'
  },
  BASKET: {
    NAME: 'basket-remote',
    URL: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASKET_URL || 'https://ecommerce-mf-case-study-basket-remo.vercel.app'
      : 'http://localhost:3002'
  }
}

// Layout Configuration
export const LAYOUT_CONFIG = {
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 64,
  CONTENT_MAX_WIDTH: 1200,
}

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'host-app-preferences',
  BASKET: 'host-app-basket',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
  NOT_FOUND: 'Kaynak bulunamadı.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  GENERIC_ERROR: 'Beklenmeyen bir hata oluştu.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Ürün sepete eklendi',
  PRODUCT_REMOVED: 'Ürün sepetten çıkarıldı',
  PRODUCT_UPDATED: 'Ürün güncellendi',
  BASKET_CLEARED: 'Sepet temizlendi',
}