import api from "../../lib/axios";
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "../../types/transaction";

export const transactionAPI = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/transactions");
    return response.data;
  },

  getUserTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/transactions/my");
    return response.data;
  },

  getTransactionById: async (id: number | string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (
    transactionData: CreateTransactionData
  ): Promise<Transaction> => {
    // Ensure all required fields are included
    const completeData = {
      ...transactionData,
      paymentMethod: transactionData.paymentMethod || "other",
      currency: transactionData.currency || "INR",
    };

    console.log("Creating transaction with data:", completeData);
    const response = await api.post("/transactions", completeData);

    // If this transaction is for a package, update the package's isPaid status
    if (transactionData.packageId) {
      try {
        await api.put(`/packages/${transactionData.packageId}`, {
          isPaid: true,
          // Also update the amount on the package to match the transaction
          amount: String(transactionData.amount),
        });
        console.log(
          `Updated package ${transactionData.packageId} with isPaid=true and amount=${transactionData.amount}`
        );
      } catch (error) {
        console.error("Failed to update package payment status:", error);
      }
    }

    return response.data;
  },

  // Create a transaction for package status change
  createPackageStatusTransaction: async (
    packageId: number | string,
    description?: string
  ): Promise<Transaction> => {
    const response = await api.post("/transactions/package-status", {
      packageId,
      description,
    });
    return response.data;
  },

  updateTransaction: async (
    id: number | string,
    updates: UpdateTransactionData
  ): Promise<Transaction> => {
    try {
      console.log(`Updating transaction ${id} with data:`, updates);

      // Ensure we're only sending valid fields to the API
      const validUpdates: UpdateTransactionData = {};

      // Only include defined fields with validation
      if (updates.status !== undefined && updates.status !== "") {
        // Validate status is one of the allowed values
        const validStatuses = ["pending", "completed", "failed"];
        if (validStatuses.includes(updates.status)) {
          validUpdates.status = updates.status;
        } else {
          console.warn(
            `Invalid status value: ${
              updates.status
            }. Must be one of: ${validStatuses.join(", ")}`
          );
        }
      }

      // Handle amount specifically - ensure it's a number
      if (updates.amount !== undefined) {
        // Convert to number if it's a string
        const numAmount =
          typeof updates.amount === "string"
            ? parseFloat(updates.amount)
            : updates.amount;
        if (!isNaN(numAmount)) {
          validUpdates.amount = numAmount;
          console.log(
            `Processing amount for update: ${
              updates.amount
            } (${typeof updates.amount}) -> ${numAmount} (${typeof numAmount})`
          );
        } else {
          console.warn(
            `Invalid amount value: ${updates.amount}. Must be a valid number.`
          );
        }
      }

      if (updates.razorpayOrderId !== undefined)
        validUpdates.razorpayOrderId = updates.razorpayOrderId;
      if (updates.razorpayPaymentId !== undefined)
        validUpdates.razorpayPaymentId = updates.razorpayPaymentId;
      if (updates.paymentMethod !== undefined)
        validUpdates.paymentMethod = updates.paymentMethod;
      if (updates.description !== undefined)
        validUpdates.description = updates.description;

      console.log(`Sending validated updates to API:`, validUpdates);

      const response = await api.put(`/transactions/${id}`, updates);
      console.log(`Transaction update response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  },

  getTransactionOrderDetails: async (id: number | string) => {
    console.log(`Getting order details for transaction ${id}`);
    const response = await api.get(`/payments/transaction/${id}/order-details`);
    console.log("Order details response:", response.data);
    return response.data;
  },

  // Get a pending transaction for a package
  getPendingTransactionForPackage: async (packageId: number | string) => {
    console.log(`Checking for pending transaction for package ${packageId}`);
    const response = await api.get(
      `/transactions/package/${packageId}/pending-transaction`
    );
    console.log("Pending transaction response:", response.data);
    return response.data;
  },

  updateTransactionFields: async (
    id: number | string,
    updates: UpdateTransactionData
  ): Promise<Transaction> => {
    try {
      console.log(`Updating transaction ${id} fields:`, updates);

      // Ensure dimensions are properly formatted
      const formattedUpdates = { ...updates };

      // Convert string values to numbers for dimensions if needed
      if (formattedUpdates.dimensions) {
        formattedUpdates.dimensions = {
          width: Number(formattedUpdates.dimensions.width),
          height: Number(formattedUpdates.dimensions.height),
          length: Number(formattedUpdates.dimensions.length),
          unit: formattedUpdates.dimensions.unit,
        };
      }

      const response = await api.put(
        `/transactions/${id}/update-fields`,
        formattedUpdates
      );

      console.log("Transaction fields update response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction ${id} fields:`, error);
      throw error;
    }
  },

  // Move transaction to completed
  moveToCompleted: async (id: number | string): Promise<Transaction> => {
    const response = await api.post(`/transactions/${id}/complete`);
    return response.data;
  },

  // Get all completed transactions
  getCompletedTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/completed-transactions");
    return response.data;
  },

  // Get completed transactions for a package
  getCompletedTransactionsByPackage: async (
    packageId: number | string
  ): Promise<Transaction[]> => {
    const response = await api.get(
      `/completed-transactions/package/${packageId}`
    );
    return response.data;
  },
};
