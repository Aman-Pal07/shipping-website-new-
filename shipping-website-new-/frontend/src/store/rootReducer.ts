import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import packageReducer from '../features/packages/packageSlice';
import transactionReducer from '../features/transactions/transactionSlice';
import completedTransactionReducer from '../features/completedTransactions/completedTransactionSlice';
import settingsReducer from '../features/settings/settingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  packages: packageReducer,
  transactions: transactionReducer,
  completedTransactions: completedTransactionReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
