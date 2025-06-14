import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, UpdatePackageStatusPayload } from "../../types/transaction";
import { completedTransactionAPI } from "./completedTransactionAPI";
import { toast } from "react-hot-toast";

interface UpdateAdminTrackingIdPayload {
  id: string;
  adminTrackingId: string;
  notes?: string;
}

interface CompletedTransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
}

const initialState: CompletedTransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  selectedTransaction: null,
};

// Async thunks
export const fetchAllCompletedTransactions = createAsyncThunk(
  "completedTransactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all completed transactions...");
      const response =
        await completedTransactionAPI.getAllCompletedTransactions();
      console.log("API Response:", response);
      return response;
    } catch (error: any) {
      console.error("Error fetching completed transactions:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch completed transactions"
      );
    }
  }
);

export const fetchMyCompletedTransactions = createAsyncThunk(
  "completedTransactions/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await completedTransactionAPI.getMyCompletedTransactions();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch your completed transactions"
      );
    }
  }
);

export const updateAdminTrackingId = createAsyncThunk<
  Transaction,
  UpdateAdminTrackingIdPayload,
  { rejectValue: string }
>(
  "completedTransactions/updateAdminTrackingId",
  async ({ id, adminTrackingId, notes }, { rejectWithValue, dispatch }) => {
    try {
      const response = await completedTransactionAPI.updateAdminTrackingId(
        id,
        adminTrackingId,
        notes
      );
      
      // Refresh the transactions list to ensure we have the latest data
      await dispatch(fetchAllCompletedTransactions());
      
      toast.success("Tracking information updated successfully");
      return response; // The response is already the transaction object
    } catch (error: any) {
      console.error("Error updating tracking ID:", error);
      const errorMessage = error.response?.data?.message || "Failed to update tracking information";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePackageStatus = createAsyncThunk(
  "completedTransactions/updatePackageStatus",
  async (
    { id, packageStatus }: UpdatePackageStatusPayload,
    { rejectWithValue }
  ) => {
    try {
      console.log('Updating package status:', { id, packageStatus });
      const response = await completedTransactionAPI.updatePackageStatus(
        id,
        packageStatus
      );
      console.log('Package status update response:', response);
      toast.success(`Package status updated to ${packageStatus}`);
      return response;
    } catch (error: any) {
      console.error('Error updating package status:', error);
      const errorMessage = error.response?.data?.message || "Failed to update package status";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const completedTransactionsSlice = createSlice({
  name: "completedTransactions",
  initialState,
  reducers: {
    setSelectedTransaction: (
      state,
      action: PayloadAction<Transaction | null>
    ) => {
      state.selectedTransaction = action.payload;
    },
    clearCompletedTransactions: (state) => {
      state.transactions = [];
      state.selectedTransaction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllCompletedTransactions
    builder.addCase(fetchAllCompletedTransactions.pending, (state) => {
      console.log("fetchAllCompletedTransactions pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAllCompletedTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        console.log("fetchAllCompletedTransactions fulfilled", {
          payload: action.payload,
        });
        state.loading = false;
        state.transactions = Array.isArray(action.payload)
          ? action.payload
          : [];
        console.log("Updated state.transactions:", state.transactions);
      }
    );
    builder.addCase(fetchAllCompletedTransactions.rejected, (state, action) => {
      console.error("fetchAllCompletedTransactions rejected:", action.payload);
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateAdminTrackingId
    builder.addCase(updateAdminTrackingId.fulfilled, (state, action: PayloadAction<Transaction>) => {
      const updatedTransaction = action.payload;
      
      // Update in transactions array
      state.transactions = state.transactions.map(tx => 
        tx._id === updatedTransaction._id ? updatedTransaction : tx
      );
      
      // Update selected transaction if it's the one being updated
      if (state.selectedTransaction?._id === updatedTransaction._id) {
        state.selectedTransaction = updatedTransaction;
      }
      
      state.loading = false;
    });

    // updatePackageStatus
    builder.addCase(updatePackageStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePackageStatus.fulfilled, (state, action) => {
      const updatedTransaction = action.payload;
      console.log('Redux: Updating transaction with packageStatus:', updatedTransaction?.packageStatus);
      
      if (!updatedTransaction) {
        console.error('No transaction returned from update');
        state.loading = false;
        return;
      }

      // Update in transactions array
      state.transactions = state.transactions.map((tx) => {
        if (tx._id === updatedTransaction._id) {
          console.log('Updating transaction in state:', {
            oldStatus: tx.packageStatus,
            newStatus: updatedTransaction.packageStatus
          });
          return {
            ...tx,
            ...updatedTransaction // Spread the entire updated transaction
          };
        }
        return tx;
      });
      
      // Update selected transaction if it's the one being updated
      if (state.selectedTransaction?._id === updatedTransaction._id) {
        state.selectedTransaction = {
          ...state.selectedTransaction,
          ...updatedTransaction
        };
      }
      
      state.loading = false;
      console.log('Redux: Updated transactions state:', state.transactions);
    });
    builder.addCase(updatePackageStatus.rejected, (state, action) => {
      console.error('Failed to update package status:', action.payload);
      state.loading = false;
      state.error = action.payload as string;
      toast.error(`Failed to update package status: ${action.payload}`);
    });

    // fetchMyCompletedTransactions
    builder.addCase(fetchMyCompletedTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchMyCompletedTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchMyCompletedTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedTransaction, clearCompletedTransactions } =
  completedTransactionsSlice.actions;

export default completedTransactionsSlice.reducer;
