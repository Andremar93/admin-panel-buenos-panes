import axios from 'axios';

// Configurá la URL base de tu backend Express
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: agregar interceptor para manejar token JWT si usás autenticación

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('Token inválido o expirado');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        window.location.href = '/login';
      }
      // Devolvés un error controlado
      throw new Error(
        error.response.data.message || 'Error en la respuesta del servidor'
      );
    }

    // Si no hay respuesta (por ejemplo, servidor caído)
    if (error.request) {
      throw new Error('No hay respuesta del servidor. Verificá tu conexión.');
    }

    // Otro tipo de error (por ejemplo, error en el interceptor mismo)
    throw new Error(error.message || 'Ocurrió un error inesperado');
  }
);

export default api;
