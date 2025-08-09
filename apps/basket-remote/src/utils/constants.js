// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://fakestoreapi.com',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
}

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || 'basket-remote',
  VERSION: process.env.REACT_APP_APP_VERSION || '1.0.0',
  PORT: process.env.REACT_APP_PORT || 3002,
  HOST_URL: process.env.REACT_APP_HOST_URL || 'http://localhost:3000',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  BASKET: 'basket-remote-data',
  USER_PREFERENCES: 'basket-remote-preferences',
}

// Responsive Breakpoints (Ant Design)
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
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