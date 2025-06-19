import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
});

// Add a request interceptor to include auth token if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
