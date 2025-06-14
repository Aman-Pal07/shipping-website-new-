import axios from "axios";

// Make sure this matches your server's port (3000 in this case)
const API_URL = "http://localhost:3000/api";

// Get the authentication token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const requestEmailUpdate = async (data: { email: string }) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Sending request to:', `${API_URL}/auth/request-email-update`);
  console.log('Request data:', data);
  
  try {
    const response = await axios.post(
      `${API_URL}/auth/request-email-update`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    console.log('Response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in requestEmailUpdate:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const verifyEmailUpdate = async (data: {
  email: string;
  otp: string;
}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Sending request to:', `${API_URL}/auth/verify-email-update`);
  console.log('Request data:', data);
  
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify-email-update`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    console.log('Response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in verifyEmailUpdate:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
