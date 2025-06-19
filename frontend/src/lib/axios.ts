import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { rateLimiter } from "@/utils/rateLimiter";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Track active requests to prevent duplicate calls
const activeRequests = new Map<string, Promise<any>>();

// Helper function to generate request key
const getRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
};

// Request interceptor to add auth token and handle rate limiting
api.interceptors.request.use(
  async (config) => {
    // Add auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip rate limiting for auth endpoints
    const isAuthEndpoint = config.url?.includes('auth');
    if (isAuthEndpoint) {
      return config;
    }

    // Check rate limiting
    const endpoint = config.url?.split('?')[0] || '';
    if (!rateLimiter.canMakeRequest(endpoint)) {
      const remainingTime = rateLimiter.getRemainingTime(endpoint);
      console.warn(`Rate limited. Please wait ${Math.ceil(remainingTime / 1000)} seconds`);
      return Promise.reject({
        response: {
          status: 429,
          data: {
            message: `Too many requests. Please wait ${Math.ceil(remainingTime / 1000)} seconds`
          }
        }
      });
    }

    // Check for duplicate requests
    const requestKey = getRequestKey(config);
    if (activeRequests.has(requestKey)) {
      return activeRequests.get(requestKey);
    }

    // Add request to active requests
    const requestPromise = new Promise((resolve) => {
      setTimeout(() => {
        activeRequests.delete(requestKey);
        resolve(config);
      }, 100); // Small delay to prevent rapid duplicate requests
    });

    activeRequests.set(requestKey, requestPromise);
    return requestPromise;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with retry logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clear any rate limiting for successful responses
    const endpoint = response.config.url?.split('?')[0];
    if (endpoint) {
      // Reset rate limit for this endpoint on successful response
      rateLimiter.clearRateLimit(endpoint);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return api(originalRequest);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/login") &&
        !currentPath.includes("/register") &&
        !currentPath.includes("/verify-email")
      ) {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          status: 0,
          data: { message: 'Network Error. Please check your connection.' }
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
