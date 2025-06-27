import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TrendingUp, Package, Users, DollarSign } from "lucide-react";

// Define types for our dashboard data
interface DashboardStats {
  userStats: {
    totalUsers: number;
  };
  packageStats: {
    waiting: number;
    inTransit: number;
    india: number;
    dispatch: number;
    total: number;
  };
  recentActivity: {
    packages: any[];
    transactions: any[];
  };
  financialStats: {
    totalRevenue: number;
    currency: string;
    transactionCount: number;
  };
}

export default function Overview() {
  // Get auth state from Redux store
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // State for dashboard data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Use the configured api instance that already includes the auth token
      const response = await api.get("/admin/stats", {
        params: { _t: new Date().getTime() }, // Add cache-busting parameter
      });

      // Check if data is valid
      if (!response.data || !response.data.packageStats) {
        throw new Error("Invalid data received from server");
      }

      setStats(response.data);

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setError("You need to be logged in to view this dashboard");
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor your business performance and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Total Packages Card */}
          <a href="/admin/packages" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Packages
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.packageStats.total.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">
                  Updated in real-time
                </span>
              </div>
            </div>
          </a>

          {/* Active Users Card */}
          <a href="/admin/users" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.userStats.totalUsers.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">
                  Updated in real-time
                </span>
              </div>
            </div>
          </a>

          {/* Revenue Card */}
          <a href="/admin/transactions" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.financialStats.currency === "USD" ? "$" : "₹"}
                    {stats?.financialStats.totalRevenue.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">
                  {stats?.financialStats.transactionCount || 0} transactions
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Packages */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Packages
              </h2>
              <p className="text-gray-600 mt-1">Latest package activities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Tracking ID
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentActivity.packages.length ? (
                    stats.recentActivity.packages.map((pkg: any) => (
                      <tr
                        key={pkg._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-sm">
                          #{pkg.trackingId}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {pkg.userId?.username || "Unknown User"}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pkg.status === "waiting"
                                ? "bg-yellow-100 text-yellow-800"
                                : pkg.status === "in_transit"
                                ? "bg-blue-100 text-blue-800"
                                : pkg.status === "india"
                                ? "bg-purple-100 text-purple-800"
                                : pkg.status === "dispatch"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {pkg.status === "in_transit"
                              ? "In Transit"
                              : pkg.status.charAt(0).toUpperCase() +
                                pkg.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <a
                            href={`/admin/packages/${pkg._id}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-gray-500"
                      >
                        No recent packages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Transactions
              </h2>
              <p className="text-gray-600 mt-1">Latest financial activities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Transaction ID
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentActivity.transactions.length ? (
                    stats.recentActivity.transactions.map(
                      (transaction: any) => (
                        <tr
                          key={transaction._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 font-mono text-sm">
                            #{transaction._id.substring(0, 8)}
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-800">
                            {transaction.userId?.username || "Unknown User"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-800">
                            {transaction.currency === "USD" ? "$" : "₹"}
                            {transaction.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <a
                              href={`/admin/transactions/${transaction._id}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-500"
                      >
                        No recent transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
