import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Terms from "../pages/public/Terms";
import NotFound from "../pages/public/NotFound";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import EmailVerification from "../pages/auth/EmailVerification";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin Pages
import AdminOverview from "../pages/admin/Overview";
import AdminOrders from "../pages/admin/Orders";
import AdminUsers from "../pages/admin/Users";
import AdminTrack from "../pages/admin/Track";
import AdminTransactions from "../pages/admin/Transactions";
import CompletedTransactions from "../pages/admin/CompletedTransactions";
import AdminSecurity from "../pages/admin/settings/Security";
import AdminInsurance from "../pages/admin/settings/Insurance";
import AdminTerms from "../pages/admin/settings/Terms";

// User Pages
import UserOverview from "../pages/user/Overview";
import UserOrders from "../pages/user/Orders";
import UserAddress from "../pages/user/Address";
import UserTrack from "../pages/user/Track";
import UserTransactions from "../pages/user/Transactions";
import PackagesByStatusPage from "../pages/user/PackagesByStatusPage";
import UserPersonalDetails from "../pages/dashboard/UserPersonalDetails";

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useSelector(
    (state: RootState) => state.auth
  );
  // Use userRole directly from auth state for immediate role detection
  const isAdmin = userRole === "admin";

  return (
    <Routes>
      {/* Auth Routes - Outside MainLayout to hide sidebar */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
          ) : (
            <Register />
          )
        }
      />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />

      {/* Admin Routes - Outside MainLayout to have separate admin layout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="track" element={<AdminTrack />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route
          path="completed-transactions"
          element={<CompletedTransactions />}
        />
        <Route path="settings/security" element={<AdminSecurity />} />
        <Route path="settings/insurance" element={<AdminInsurance />} />
        <Route path="settings/terms" element={<AdminTerms />} />
      </Route>

      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserOverview />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="address" element={<UserAddress />} />
          <Route path="address/:countryCode" element={<UserAddress />} />
          <Route path="track" element={<UserTrack />} />
          <Route path="transactions" element={<UserTransactions />} />
          <Route path="packages" element={<PackagesByStatusPage />} />
          <Route path="settings" element={<UserPersonalDetails />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
