import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import packagesReducer from "../features/packages/packageSlice";
import usersReducer from "../features/users/userSlice";
import transactionsReducer from "../features/transactions/transactionSlice";
import completedTransactionsReducer from "../features/completedTransactions/completedTransactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    users: usersReducer,
    transactions: transactionsReducer,
    completedTransactions: completedTransactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
