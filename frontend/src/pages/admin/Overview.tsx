import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Route,
  Activity,
} from "lucide-react";

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

// Define type for data points
interface DataPoint {
  month: string;
  value: number;
  shipments: number;
}

// Shipment Trends Component
const ShipmentTrendsGraphs = ({ stats }: { stats: DashboardStats | null }) => {
  // Generate dynamic data points based on package stats
  const dataPoints: DataPoint[] = [];

  // Calculate the average value for each status
  const waitingAvg = stats?.packageStats.waiting || 0;
  const inTransitAvg = stats?.packageStats.inTransit || 0;
  const indiaAvg = stats?.packageStats.india || 0;
  const dispatchAvg = stats?.packageStats.dispatch || 0;

  // Generate data points for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // Get dates for last 7 days
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

    // Calculate dynamic values based on package status percentages
    const value = Math.round(
      waitingAvg * 0.2 + inTransitAvg * 0.3 + indiaAvg * 0.3 + dispatchAvg * 0.2
    );

    dataPoints.push({
      month: formattedDate,
      value: value,
      shipments: stats?.packageStats.total || 0,
    });
  }

  // Calculate path for the line chart
  const createPath = () => {
    const width = 280;
    const height = 120;
    const padding = 20;

    const maxValue = Math.max(...dataPoints.map((d) => d.value));
    const minValue = Math.min(...dataPoints.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return dataPoints
      .map((point, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (dataPoints.length - 1);
        const y =
          height -
          padding -
          ((point.value - minValue) / range) * (height - 2 * padding);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  // Calculate efficiency based on package stats
  const calculateEfficiency = () => {
    if (!stats?.packageStats.total) return 0;
    const delivered =
      stats.packageStats.total -
      stats.packageStats.waiting -
      stats.packageStats.inTransit;
    return Math.round((delivered / stats.packageStats.total) * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Shipment Trends Card */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Shipment Trends</h3>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
          <svg width="280" height="120" className="w-full">
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 20"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Data line */}
            <path
              d={createPath()}
              fill="none"
              stroke="url(#blueGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>

            {/* Data points */}
            {dataPoints.map((point, index) => {
              const width = 280;
              const height = 120;
              const padding = 20;
              const maxValue = Math.max(...dataPoints.map((d) => d.value));
              const minValue = Math.min(...dataPoints.map((d) => d.value));
              const range = maxValue - minValue || 1;

              const x =
                padding +
                (index * (width - 2 * padding)) / (dataPoints.length - 1);
              const y =
                height -
                padding -
                ((point.value - minValue) / range) * (height - 2 * padding);

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 transition-all cursor-pointer drop-shadow-sm"
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-sm text-gray-600 font-medium">
            {dataPoints.map((point, index) => (
              <span key={index}>{point.month}</span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            {stats?.packageStats.total || 0} shipments
          </span>
        </div>
      </div>

      {/* Route Efficiency Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Route className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Route Efficiency</h3>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-5xl font-bold mb-2">
            {calculateEfficiency()}%
          </div>
          <p className="text-blue-100 font-medium">Overall Performance</p>
        </div>

        <div className="relative mb-6">
          <svg width="200" height="60" className="w-full opacity-90">
            {/* Background dots pattern */}
            <defs>
              <pattern
                id="dots"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="6" cy="6" r="1.5" fill="rgba(255,255,255,0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />

            {/* Efficiency trend line */}
            <path
              d="M 20 40 Q 60 30 100 25 T 180 20"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Peak indicator */}
            <circle
              cx="140"
              cy="22"
              r="4"
              fill="white"
              className="drop-shadow-sm"
            />
            <text
              x="145"
              y="18"
              className="text-xs fill-current font-semibold"
              fontSize="11"
            >
              Optimal Route
            </text>
          </svg>
        </div>

        <div className="text-blue-100 font-medium">
          Send the best route to driver's email
        </div>

        {/* Decorative background elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -right-8 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 -left-8 w-20 h-20 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

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

        {/* Shipment Trends Graphs */}
        <ShipmentTrendsGraphs stats={stats} />

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
