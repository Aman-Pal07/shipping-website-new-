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

  // Register new user with file uploads
  register: async (formData: FormData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
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
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
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
};
