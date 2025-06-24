import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUserTransactions } from "../../features/transactions/transactionSlice";
import { Search, ChevronDown, Eye, Package } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import api from "../../lib/axios";

// Add Razorpay to the window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Function to load Razorpay SDK
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Transaction type for the component
interface TransactionItem {
  id: string | number;
  userId: string;
  packageId: string;
  amount: number;
  status: string;
  type: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  razorpayOrderId?: string;
  currency?: string;
  adminTrackingId?: string;
  dimensions?: {
    width: number;
    height: number;
    length: number;
    unit: string;
  };
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  orderId?: string;
  weight?: number;
  weightUnit?: string;
}

export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { userTransactions } = useSelector(
    (state: RootState) => state.transactions
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [localTransactions, setLocalTransactions] = useState<TransactionItem[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch user transactions when component mounts
  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  // Load Razorpay SDK when component mounts
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Update local transactions when redux state changes
  useEffect(() => {
    if (userTransactions) {
      const formattedTransactions: TransactionItem[] = userTransactions
        .filter((txn: any) => txn !== null)
        .map((txn: any) => {
          try {
            const isRefund =
              (txn.amount &&
                (typeof txn.amount === "string"
                  ? txn.amount.startsWith("-")
                  : txn.amount < 0)) ||
              (txn.description &&
                txn.description.toLowerCase().includes("refund"));

            const packageData =
              txn.packageId && typeof txn.packageId === "object"
                ? txn.packageId
                : {};

            return {
              id:
                txn._id ||
                txn.id ||
                `txn-${Math.random().toString(36).substring(2, 10)}`,
              userId: txn.userId || "unknown",
              packageId: txn.packageId?._id || txn.packageId || "unknown",
              type: isRefund ? "refund" : "payment",
              status: txn.status || "pending",
              amount: txn.amount
                ? typeof txn.amount === "string"
                  ? parseFloat(txn.amount) || 0
                  : Math.abs(txn.amount || 0)
                : 0,
              createdAt: txn.createdAt
                ? new Date(txn.createdAt).toISOString()
                : new Date().toISOString(),
              updatedAt: txn.updatedAt
                ? new Date(txn.updatedAt).toISOString()
                : new Date().toISOString(),
              description: txn.description || "No description",
              paymentMethod: txn.paymentMethod || "credit_card",
              razorpayOrderId: txn.razorpayOrderId,
              currency: txn.currency || "INR",
              adminTrackingId: packageData.trackingId || txn.adminTrackingId,
              dimensions: txn.dimensions,
              volumetricWeight: txn.volumetricWeight,
              volumetricWeightUnit: txn.volumetricWeightUnit,
              orderId: txn.orderId,
              weight: packageData.weight || txn.weight,
              weightUnit: packageData.weightUnit || txn.weightUnit,
            };
          } catch (error) {
            console.error("Error processing transaction:", error, txn);
            return {
              id: `error-${Math.random().toString(36).substring(2, 10)}`,
              userId: "unknown",
              packageId: "unknown",
              type: "payment",
              status: "error",
              amount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              description: "Error processing transaction data",
              paymentMethod: "unknown",
              currency: "INR",
              adminTrackingId: "N/A",
              dimensions: { width: 0, height: 0, length: 0, unit: "cm" },
              volumetricWeight: 0,
              volumetricWeightUnit: "kg",
              orderId: "N/A",
              weight: 0,
              weightUnit: "kg",
            };
          }
        });
      setLocalTransactions(formattedTransactions);
    } else {
      setLocalTransactions([]);
    }
  }, [userTransactions]);

  // Filter transactions based on search term and filters
  const filteredTransactions = localTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false);

    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  // Function to verify payment with Razorpay
  const verifyRazorpayPayment = async (
    orderId: string,
    paymentId: string,
    signature: string,
    transactionId: string
  ) => {
    try {
      const response = await api.post("/payments/verify", {
        orderId,
        paymentId,
        signature,
        transactionId,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Payment verification failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Payment verification failed",
      };
    }
  };

  const handlePay = async (transaction: TransactionItem) => {
    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        return;
      }

      toast.loading("Preparing payment...");

      try {
        const response = await api.post("/payments/create-order", {
          amount: transaction.amount,
          packageId: transaction.packageId,
          description: transaction.description,
          transactionId: transaction.id,
        });

        const {
          orderId,
          amount,
          currency,
          keyId,
          transactionId: newTransactionId,
        } = response.data;

        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "Shipping Website",
          description: transaction.description || "Package payment",
          order_id: orderId,
          handler: async function (response: any) {
            try {
              const verificationResult = await verifyRazorpayPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                newTransactionId
              );

              if (verificationResult.success) {
                toast.dismiss();
                toast.success("Payment successful!");
                dispatch(fetchUserTransactions());
              } else {
                throw new Error(
                  verificationResult.error || "Payment verification failed"
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.dismiss();
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Payment verification failed. Please contact support."
              );
            }
          },

          notes: {
            transactionId: newTransactionId,
            userId: user?.id,
            source: "shipping_website",
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: function () {
              toast.dismiss();
              toast("Payment was cancelled. You can try again.");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response: any) {
          toast.dismiss();
          console.error("Payment failed:", response.error);

          if (response.error.code === "PAYMENT_CANCELLED") {
            toast.error("Payment was cancelled. Please try again.");
          } else if (response.error.description) {
            toast.error(`Payment failed: ${response.error.description}`);
          } else {
            toast.error("Payment failed. Please try again or contact support.");
          }
        });

        razorpay.open();
      } catch (error) {
        console.error("Payment preparation error:", error);
        toast.dismiss();
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to prepare payment. Please try again."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again or contact support."
      );
    }
  };

  const handleViewDetails = (transaction: TransactionItem) => {
    console.log("View details for transaction:", transaction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="mx-auto w-full max-w-[95%] sm:max-w-4xl lg:max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            My Transactions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Track and manage your payment history
          </p>
        </div>

        {/* Main Transactions Card */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 mb-6 sm:mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Search and Filters */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
                </div>
                <input
                  type="text"
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 w-full bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-blue-100 text-white text-sm sm:text-base"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <select
                    className="appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-3 w-full bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm sm:text-base"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all" className="text-gray-800">
                      All Types
                    </option>
                    <option value="payment" className="text-gray-800">
                      Payment
                    </option>
                    <option value="refund" className="text-gray-800">
                      Refund
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200" />
                  </div>
                </div>

                <div className="relative flex-1">
                  <select
                    className="appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-3 w-full bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm sm:text-base"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all" className="text-gray-800">
                      All Statuses
                    </option>
                    <option value="pending" className="text-gray-800">
                      Pending
                    </option>
                    <option value="completed" className="text-gray-800">
                      Completed
                    </option>
                    <option value="failed" className="text-gray-800">
                      Failed
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vol. Weight
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2" />
                        <p className="text-base sm:text-lg font-medium text-gray-500">
                          No transactions found
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          There are no transactions to display
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatDateTime(transaction.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {transaction.adminTrackingId || "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {transaction.weight !== undefined &&
                        transaction.weight !== null
                          ? `${transaction.weight} ${
                              transaction.weightUnit || "kg"
                            }`
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {transaction.dimensions
                          ? `${transaction.dimensions.length}×${transaction.dimensions.width}×${transaction.dimensions.height} ${transaction.dimensions.unit}`
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {transaction.volumetricWeight
                          ? `${transaction.volumetricWeight} ${
                              transaction.volumetricWeightUnit || "kg"
                            }`
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {transaction.status === "pending" &&
                            transaction.amount > 0 && (
                              <button
                                onClick={() => handlePay(transaction)}
                                className="text-green-600 hover:text-green-900 font-semibold text-xs sm:text-sm"
                              >
                                Pay
                              </button>
                            )}
                          <button
                            onClick={() => handleViewDetails(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile screens */}
          <div className="sm:hidden divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <Package className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-base font-medium text-gray-500">
                    No transactions found
                  </p>
                  <p className="text-xs text-gray-400">
                    There are no transactions to display
                  </p>
                </div>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-900">Date:</span>
                      <p className="text-gray-500">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Tracking ID:
                      </span>
                      <p className="text-gray-500">
                        {transaction.adminTrackingId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Weight:</span>
                      <p className="text-gray-500">
                        {transaction.weight !== undefined &&
                        transaction.weight !== null
                          ? `${transaction.weight} ${
                              transaction.weightUnit || "kg"
                            }`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Amount:</span>
                      <p className="text-gray-500">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Dimensions:
                      </span>
                      <p className="text-gray-500">
                        {transaction.dimensions
                          ? `${transaction.dimensions.length}×${transaction.dimensions.width}×${transaction.dimensions.height} ${transaction.dimensions.unit}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Status:</span>
                      <p>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Vol. Weight:
                      </span>
                      <p className="text-gray-500">
                        {transaction.volumetricWeight
                          ? `${transaction.volumetricWeight} ${
                              transaction.volumetricWeightUnit || "kg"
                            }`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Actions:
                      </span>
                      <div className="flex space-x-2 mt-1">
                        {transaction.status === "pending" &&
                          transaction.amount > 0 && (
                            <button
                              onClick={() => handlePay(transaction)}
                              className="text-green-600 hover:text-green-900 font-semibold text-xs"
                            >
                              Pay
                            </button>
                          )}
                        <button
                          onClick={() => handleViewDetails(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {filteredTransactions.length} of{" "}
              {localTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200 text-xs sm:text-sm"
                disabled
              >
                Previous
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
