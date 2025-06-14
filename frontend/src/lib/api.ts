import api from './axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const apiRequest = async <T = any>(
  method: HttpMethod,
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default apiRequest;
