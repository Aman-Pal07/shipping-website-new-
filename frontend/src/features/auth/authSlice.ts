import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  authAPI,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VerifyEmailData,
  VerifyEmailResponse,
} from "./authAPI";
import { User } from "../../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean; // Keeping for backward compatibility
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
  userRole: localStorage.getItem("userRole") || null,
};

// Async thunks
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.token);
      // Force immediate role recognition
      localStorage.setItem("userRole", response.user.role);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Convert RegisterData to FormData
      const formData = new FormData();
      formData.append("firstName", userData.firstName.trim());
      formData.append("lastName", userData.lastName.trim());
      formData.append("email", userData.email.trim());
      formData.append("phoneNumber", userData.phoneNumber.trim());
      formData.append("password", userData.password);

      // Add document types as JSON
      const documentTypes = userData.documents.map((doc) => ({
        documentType: doc.documentType,
      }));
      formData.append("documentTypes", JSON.stringify(documentTypes));

      // Add document files
      userData.documents.forEach((doc) => {
        if (doc.file) {
          formData.append("documents", doc.file);
        }
      });

      console.log("Sending registration data:");
      // Log form data entries
      for (let pair of (formData as any).entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      // Make the API call
      const response = await authAPI.register(formData);

      // Only store token if no verification is required
      // If verification is required, the token will be stored after verification
      if (response.token && !response.requiresVerification) {
        localStorage.setItem("token", response.token);
        if (response.user?.role) {
          localStorage.setItem("userRole", response.user.role);
        }
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Track if we've already loaded the user
let hasLoadedUser = false;

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState } }
>("auth/getCurrentUser", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();

    // Don't fetch if we already have user data and it's already been loaded once
    if (hasLoadedUser && auth.user?._id) {
      return auth.user;
    }

    const user = await authAPI.getCurrentUser();
    
    // Mark that we've successfully loaded the user
    hasLoadedUser = true;

    // Update role in localStorage for immediate access
    localStorage.setItem("userRole", user.role);

    // Check if user is verified
    if (!user.isVerified) {
      // If user is not verified, store email for verification page
      localStorage.setItem("pendingVerificationEmail", user.email);
    }

    return user;
  } catch (error: any) {
    // Clear invalid token if the request fails with 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      // Reset the loaded state on auth failure
      hasLoadedUser = false;
    }
    return rejectWithValue(
      error.response?.data?.message || "Failed to get user"
    );
  }
});

export const logoutUser = createAsyncThunk<void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    } catch (error: any) {
      // Still remove token even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailData
>("auth/verifyEmail", async (verificationData, { rejectWithValue }) => {
  try {
    const response = await authAPI.verifyEmail(verificationData);
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("token", response.token);
      if (response.role) {
        localStorage.setItem("userRole", response.role);
      }
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Email verification failed"
    );
  }
});

export const resendVerificationCode = createAsyncThunk<void, string>(
  "auth/resendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      await authAPI.resendVerificationCode(email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification code"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk<string, string>(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return (
        response.message ||
        "If your email is registered, you will receive a password reset link."
      );
    } catch (error: any) {
      // Don't reveal if the email exists or not for security
      return rejectWithValue(
        "If your email is registered, you will receive a password reset link."
      );
    }
  }
);

export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; password: string }
>("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const response = await authAPI.resetPassword(token, password);
    return {
      message: response.message || "Password has been reset successfully.",
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        "Failed to reset password. The link may have expired."
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userRole = action.payload.user.role;
      state.error = null;
      localStorage.setItem("userRole", action.payload.user.role);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.userRole = action.payload.role;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userRole = action.payload.user.role;
        state.error = null; // Ensure error is cleared
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userRole = action.payload.user.role;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.userRole = null;
        state.error = null;
      })
      // Email verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, clearCredentials, clearError } =
  authSlice.actions;
export default authSlice.reducer;
