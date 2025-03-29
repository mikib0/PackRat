import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { store } from '~/atoms/store';
import { tokenAtom } from '~/features/auth/atoms/authAtoms';

// Define base API URL based on environment
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await store.get(tokenAtom);

      console.log('token', token);

      // If token exists, attach it to the request
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Error attaching auth token:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // You could dispatch a logout action or redirect to login
      console.warn('Authentication error: Token may be expired');
      // Could add logic to refresh token here if needed
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): { message: string; status?: number } => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;
    return { message, status };
  }

  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};

// Export the configured axios instance as default
export default axiosInstance;
