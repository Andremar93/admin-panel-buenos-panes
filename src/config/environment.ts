// Configuración de entorno
export const config = {
  // Entorno
  env: import.meta.env.VITE_APP_ENV || 'development',
  
  // URLs de API
  apiUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001',
  
  // Configuración de logs
  enableLogs: import.meta.env.VITE_APP_ENABLE_LOGS === 'true',
  enableDebug: import.meta.env.VITE_APP_ENABLE_DEBUG === 'true',
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Configuración de features
  features: {
    charts: true,
    filters: true,
    export: false,
    notifications: true,
  },
  
  // Configuración de performance
  performance: {
    debounceDelay: 300,
    throttleDelay: 100,
    maxRetries: 3,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
  },
};

// Función helper para logging condicional
export const log = {
  info: (message: string, ...args: unknown[]) => {
    if (config.enableLogs) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (config.enableLogs) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    if (config.enableLogs) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (config.enableDebug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

// Función helper para verificar si estamos en desarrollo
export const isDev = () => config.isDevelopment;

// Función helper para verificar si estamos en producción
export const isProd = () => config.isProduction;
