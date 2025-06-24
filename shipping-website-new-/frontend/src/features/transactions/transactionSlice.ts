import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { transactionAPI } from "./transactionAPI";
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "../../types/transaction";

interface TransactionsState {
  transactions: Transaction[];
  userTransactions: Transaction[];
  currentTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  userTransactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
};

export const fetchAllTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await transactionAPI.getAllTransactions();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchUserTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      return await transactionAPI.getUserTransactions();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user transactions"
      );
    }
  }
);

export const fetchTransactionById = createAsyncThunk<
  Transaction,
  number | string
>("transactions/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await transactionAPI.getTransactionById(id);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch transaction"
    );
  }
});

export const fetchTransactionsByPackageId = createAsyncThunk<
  Transaction[],
  string | number
>("transactions/fetchByPackageId", async (packageId, { rejectWithValue }) => {
  try {
    return await transactionAPI.getTransactionsByPackageId(packageId);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch transactions by package ID"
    );
  }
});

export const createTransaction = createAsyncThunk<
  Transaction,
  CreateTransactionData
>("transactions/create", async (transactionData, { rejectWithValue }) => {
  try {
    return await transactionAPI.createTransaction(transactionData);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create transaction"
    );
  }
});

export const createPackageStatusTransaction = createAsyncThunk<
  Transaction,
  { packageId: number | string; description?: string }
>(
  "transactions/createPackageStatus",
  async ({ packageId, description }, { rejectWithValue }) => {
    try {
      return await transactionAPI.createPackageStatusTransaction(
        packageId,
        description
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create package status transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk<
  Transaction,
  { id: number | string; updates: UpdateTransactionData }
>("transactions/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    console.log(
      "Transaction slice: sending update with amount:",
      updates.amount
    );
    // Convert amount to number if it's a string
    if (updates.amount !== undefined) {
      updates.amount =
        typeof updates.amount === "string"
          ? parseFloat(updates.amount)
          : updates.amount;
    }
    return await transactionAPI.updateTransaction(id, updates);
  } catch (error: any) {
    console.error("Error in updateTransaction thunk:", error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to update transaction"
    );
  }
});

// Define the API response type
interface TransactionUpdateResponse {
  success: boolean;
  updatedTransaction?: Transaction;
  [key: string]: any; // Allow other properties
}

export const updateTransactionFields = createAsyncThunk<
  Transaction, // Return type
  {
    id: number | string;
    updates: UpdateTransactionData;
  }
>("transactions/updateFields", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = (await transactionAPI.updateTransactionFields(
      id,
      updates
    )) as TransactionUpdateResponse | Transaction;

    // If the response has updatedTransaction, use that, otherwise assume the response is the transaction itself
    return "updatedTransaction" in response
      ? (response.updatedTransaction as Transaction)
      : (response as Transaction);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update transaction fields"
    );
  }
});

export const moveToCompleted = createAsyncThunk<Transaction, number | string>(
  "transactions/moveToCompleted",
  async (id, { rejectWithValue }) => {
    try {
      return await transactionAPI.moveToCompleted(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to move transaction to completed"
      );
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTransaction: (state, action: PayloadAction<Transaction>) => {
      state.currentTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTransactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch transaction by ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload);
        state.userTransactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.transactions.findIndex(
          (txn) => txn._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        const userIndex = state.userTransactions.findIndex(
          (txn) => txn._id === action.payload._id
        );
        if (userIndex !== -1) {
          state.userTransactions[userIndex] = action.payload;
        }
        if (state.currentTransaction?._id === action.payload._id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create package status transaction
      .addCase(createPackageStatusTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPackageStatusTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload);
        state.userTransactions.push(action.payload);
      })
      .addCase(createPackageStatusTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update transaction fields
      .addCase(updateTransactionFields.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Fetch transactions by package ID
      .addCase(fetchTransactionsByPackageId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsByPackageId.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Fetched transactions by package ID:', action.payload);
        
        // Add the fetched transactions to the transactions array
        // and ensure we don't have duplicates
        action.payload.forEach(transaction => {
          console.log('Processing transaction:', transaction._id, 'with dimensions:', transaction.dimensions);
          const existingIndex = state.transactions.findIndex(t => t._id === transaction._id);
          if (existingIndex === -1) {
            state.transactions.push(transaction);
          } else {
            state.transactions[existingIndex] = transaction;
          }
        });
        
        console.log('Updated transactions in state:', state.transactions);
      })
      .addCase(fetchTransactionsByPackageId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTransactionFields.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTransaction = action.payload;

        if (!updatedTransaction?._id) return;

        // Create a map of updated fields for more efficient comparison
        const updatedFields = Object.entries(updatedTransaction).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // Helper to update a single transaction
        const updateTransaction = (transaction: Transaction) => {
          if (transaction._id !== updatedTransaction._id) return transaction;

          // Only update if there are actual changes
          const hasChanges = Object.entries(updatedFields).some(
            ([key, value]) =>
              JSON.stringify(transaction[key as keyof Transaction]) !==
              JSON.stringify(value)
          );

          return hasChanges
            ? { ...transaction, ...updatedFields }
            : transaction;
        };

        // Update transactions array
        state.transactions = state.transactions.map(updateTransaction);

        // Update userTransactions array
        state.userTransactions = state.userTransactions.map(updateTransaction);

        // Update currentTransaction if it's the one being updated
        if (state.currentTransaction?._id === updatedTransaction._id) {
          state.currentTransaction = updateTransaction(
            state.currentTransaction
          );
        }
      })
      .addCase(updateTransactionFields.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Move to completed
      .addCase(moveToCompleted.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveToCompleted.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = state.transactions.filter(
          (tx) => tx._id !== action.payload._id
        );
      })
      .addCase(moveToCompleted.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
