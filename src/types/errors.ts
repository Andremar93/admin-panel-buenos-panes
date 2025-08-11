// Tipos para manejo de errores
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface BusinessError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type AppError = ApiError | ValidationError | BusinessError | Error;

// Función helper para convertir errores desconocidos a AppError
export function toAppError(error: unknown): AppError {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return error as AppError;
  }
  
  return new Error('Error desconocido');
}

// Función helper para obtener el mensaje de error
export function getErrorMessage(error: AppError): string {
  return error.message || 'Error desconocido';
}

// Función helper para verificar si es un error de API
export function isApiError(error: AppError): error is ApiError {
  return 'status' in error && typeof error.status === 'number';
}

// Función helper para verificar si es un error de validación
export function isValidationError(error: AppError): error is ValidationError {
  return 'field' in error && typeof error.field === 'string';
}

// Función helper para verificar si es un error de negocio
export function isBusinessError(error: AppError): error is BusinessError {
  return 'code' in error && typeof error.code === 'string';
}
