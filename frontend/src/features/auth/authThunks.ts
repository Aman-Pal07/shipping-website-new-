import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authAPI,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./authAPI";
import { User } from "../../types/user";

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.token);
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
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      
      // Handle documents array
      userData.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][documentType]`, doc.documentType);
        formData.append(`documents[${index}][file]`, doc.file);
      });

      const response = await authAPI.register(formData);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error: any) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk<void>("auth/logout", async () => {
  localStorage.removeItem("token");
});
