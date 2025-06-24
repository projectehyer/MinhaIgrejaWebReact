import axios from 'axios';

// Cria uma instância global do Axios com timeout de 10 segundos
const api = axios.create({
  timeout: 10000, // 10 segundos
});

// Função para injetar o interceptor (precisa do contexto de autenticação)
export function setupAxiosInterceptors({ refreshSession, logout, navigate }) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshSession();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          if (navigate) navigate('/login');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api; 