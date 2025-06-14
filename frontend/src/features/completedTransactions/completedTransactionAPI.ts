import api from "../../lib/axios";
import { Transaction } from "../../types/transaction";

export const completedTransactionAPI = {
  // Get all completed transactions (admin only)
  getAllCompletedTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/completed-transactions");
    return response.data;
  },

  // Get completed transactions for the current user
  getMyCompletedTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/completed-transactions/my");
    return response.data;
  },

  // Get completed transactions for a specific package
  getCompletedTransactionsByPackage: async (
    packageId: string | number
  ): Promise<Transaction[]> => {
    const response = await api.get(
      `/completed-transactions/package/${packageId}`
    );
    return response.data;
  },

  // Get a single completed transaction by ID
  getCompletedTransactionById: async (
    id: string | number
  ): Promise<Transaction> => {
    const response = await api.get(`/completed-transactions/${id}`);
    return response.data;
  },

  // Update admin tracking ID and notes for a completed transaction
  updateAdminTrackingId: async (
    id: string | number,
    adminTrackingId: string,
    notes?: string
  ): Promise<Transaction> => {
    const response = await api.patch(`/completed-transactions/${id}/tracking`, {
      adminTrackingId,
      notes,
    });
    // The server returns { success: boolean, data: Transaction }
    return response.data.data;
  },

  // Update package status for a completed transaction
  updatePackageStatus: async (
    id: string | number,
    packageStatus: 'Processing' | 'Dispatch'
  ): Promise<Transaction> => {
    console.log('Sending update request with status:', packageStatus);
    const response = await api.patch(`/completed-transactions/${id}/status`, {
      packageStatus,
    });
    console.log('Update response:', response.data);
    return response.data; // The data is already in response.data
  },
};
