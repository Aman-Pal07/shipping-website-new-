import api from "@/lib/axios";
import { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DocumentData {
  documentType: 'PAN Card' | 'Aadhar Card' | 'Passport';
  file: File;
  preview?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  documents: DocumentData[];
}

export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse extends User {
  token: string;
  message?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  _id?: string | number;
  username?: string;
  email?: string;
  role?: string;
  requiresVerification?: boolean;
  message?: string;
}

export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data;

    // Ensure we have a consistent user object structure
    // The server might return user properties at the root level
    if (!data.user && data._id) {
      // Check if the server indicates verification is required
      const isVerified = data.requiresVerification === true ? false : true;

      data.user = {
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role,
        isVerified: isVerified,
        createdAt: new Date(),
      };
    }

    return data;
  },

  // Register new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      
      const data = response.data;

      // Ensure we have a consistent user object structure
      if (!data.user && data._id) {
        const isVerified = data.requiresVerification === true ? false : true;
        
        data.user = {
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role || 'user',
          isVerified: isVerified,
          createdAt: new Date(),
        };
      }

      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current user
  // Cache the current user request to prevent duplicates
  _currentUserRequest: null as Promise<User> | null,
  
  getCurrentUser: async (): Promise<User> => {
    // If there's already a request in progress, return that instead of making a new one
    if (authAPI._currentUserRequest) {
      return authAPI._currentUserRequest;
    }

    try {
      authAPI._currentUserRequest = api.get("/auth/me")
        .then(response => {
          return response.data;
        })
        .finally(() => {
          // Clear the current request when it completes or fails
          authAPI._currentUserRequest = null;
        });

      return await authAPI._currentUserRequest;
    } catch (error) {
      // Clear the failed request so it can be retried
      authAPI._currentUserRequest = null;
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Verify email with verification code
  verifyEmail: async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  },

  // Resend verification code
  resendVerificationCode: async (email: string): Promise<void> => {
    await api.post("/auth/resend-verification", { email });
  },

  // Forgot password - Request password reset link
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
