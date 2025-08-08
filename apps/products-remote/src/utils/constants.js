// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
}

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'products-remote',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  PORT: process.env.NEXT_PUBLIC_PORT || 3001,
  HOST_URL: process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000',
}

// React Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_ON_WINDOW_FOCUS: false,
  RETRY: 3,
}

// Product Categories (from Fake Store API)
export const PRODUCT_CATEGORIES = [
  { key: 'all', label: 'Tüm Kategoriler' },
  { key: 'electronics', label: 'Elektronik' },
  { key: 'jewelery', label: 'Mücevher' },
  { key: "men's clothing", label: 'Erkek Giyim' },
  { key: "women's clothing", label: 'Kadın Giyim' },
]

// Sort Options
export const SORT_OPTIONS = [
  { key: 'default', label: 'Varsayılan' },
  { key: 'price-asc', label: 'Fiyat: Düşük - Yüksek' },
  { key: 'price-desc', label: 'Fiyat: Yüksek - Düşük' },
  { key: 'name-asc', label: 'İsim: A - Z' },
  { key: 'name-desc', label: 'İsim: Z - A' },
  { key: 'rating', label: 'En Çok Beğenilen' },
]

// Query Keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  PRODUCTS_BY_CATEGORY: 'products-by-category',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  BASKET: 'products-remote-basket',
  FILTERS: 'products-remote-filters',
  USER_PREFERENCES: 'products-remote-preferences',
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

// Grid Configuration
export const GRID_CONFIG = {
  GUTTER: [16, 16],
  RESPONSIVE: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 6,
  },
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
}