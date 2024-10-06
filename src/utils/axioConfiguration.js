import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://stockimagegallerybackend.online/',
  
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Don't add the token for login and register endpoints
    if (!config.url.endsWith('/login/') && !config.url.endsWith('/register/')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default instance;