import axios from 'axios';

// Configurá la URL base de tu backend Express
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
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
    console.log('Interceptor error:', error);

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('Token inválido o expirado');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        window.location.href = '/login';
      }

      const backendMessage =
        error.response.data?.error ||   
        error.response.data?.message || 
        'Error en la respuesta del servidor';

      throw new Error(backendMessage);
    }

    if (error.request) {
      throw new Error('No hay respuesta del servidor. Verificá tu conexión.');
    }

    throw new Error(error.message || 'Ocurrió un error inesperado');
  }
);


export default api;
