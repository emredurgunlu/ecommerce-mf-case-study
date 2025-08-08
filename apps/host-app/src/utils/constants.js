// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'host-app',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  PORT: process.env.NEXT_PUBLIC_PORT || 3000,
}

// Remote Apps
export const REMOTE_APPS = {
  PRODUCTS: {
    URL: process.env.NEXT_PUBLIC_PRODUCTS_REMOTE_URL || 'http://localhost:3001',
    NAME: 'products-remote',
  },
  BASKET: {
    URL: process.env.NEXT_PUBLIC_BASKET_REMOTE_URL || 'http://localhost:3002',
    NAME: 'basket-remote',
  },
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
}