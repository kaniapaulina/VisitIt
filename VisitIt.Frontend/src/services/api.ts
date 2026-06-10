import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7201/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('DEBUG Request:', config.method?.toUpperCase(), config.url, config.data);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => {
        console.log('✅ Response:', response.status, response.data);
        return response;
    },
  (error) => {
    console.error('❌ Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
      });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;