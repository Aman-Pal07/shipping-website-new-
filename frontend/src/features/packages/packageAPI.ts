import api from "../../lib/axios";
import {
  Package,
  PackageWithCustomer,
  CreatePackageData,
  UpdatePackageData,
  PackageStats,
} from "../../types/package";

export const packageAPI = {
  // Get all packages (admin)
  getAllPackages: async (): Promise<PackageWithCustomer[]> => {
    const response = await api.get("/packages");
    console.log('Packages API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  // Get user's packages
  getMyPackages: async (): Promise<Package[]> => {
    const response = await api.get("/packages/my");
    return response.data;
  },

  // Get user's packages by status
  getMyPackagesByStatus: async (status: string): Promise<Package[]> => {
    const response = await api.get(`/packages/my?status=${status}`);
    return response.data;
  },

  // Get package by ID
  getPackageById: async (id: string): Promise<Package> => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  // Create new package
  createPackage: async (packageData: CreatePackageData): Promise<Package> => {
    const response = await api.post("/packages", packageData);
    return response.data;
  },

  // Update package
  updatePackage: async (
    id: string,
    updates: UpdatePackageData
  ): Promise<Package> => {
    const response = await api.put(`/packages/${id}`, updates);
    return response.data;
  },

  // Update package status
  updatePackageStatus: async (
    id: string,
    status: string,
    location?: string
  ): Promise<Package> => {
    const response = await api.put(`/packages/${id}/status`, {
      status,
      location,
    });
    return response.data;
  },

  // Update package tracking details
  updatePackageTracking: async (
    id: string,
    trackingData: {
      currentLocation?: string;
      estimatedDeliveryDate?: string;
      trackingId?: string;
    }
  ): Promise<Package> => {
    const response = await api.put(`/packages/${id}/track`, trackingData);
    return response.data;
  },

  // Update package details
  updatePackageDetails: async (
    id: string,
    updates: {
      weight?: number;
    }
  ): Promise<Package> => {
    const response = await api.put(`/packages/${id}/details`, updates);
    return response.data;
  },

  // Update package dimensions
  updatePackageDimensions: async (
    id: string,
    dimensions: {
      width?: number;
      height?: number;
      length?: number;
      unit?: string;
    }
  ): Promise<Package> => {
    const response = await api.put(`/packages/${id}/dimensions`, {
      dimensions,
    });
    return response.data;
  },

  // Delete package
  deletePackage: async (id: string): Promise<void> => {
    await api.delete(`/packages/${id}`);
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<PackageStats> => {
    const response = await api.get("/packages/stats");
    return response.data;
  },

  // Search packages by tracking ID
  searchPackages: async (query: string): Promise<PackageWithCustomer[]> => {
    const response = await api.get(
      `/packages?search=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};
