// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'host-app',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  PORT: process.env.NEXT_PUBLIC_PORT || 3000,
  HOST_URL:process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3001',
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