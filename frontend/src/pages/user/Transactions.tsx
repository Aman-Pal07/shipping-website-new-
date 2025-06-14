import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUserTransactions } from "../../features/transactions/transactionSlice";
import { Search, ChevronDown, Eye, Calendar, CreditCard } from "lucide-react";
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
        .filter((txn: any) => txn !== null) // Filter out null transactions
        .map((txn: any) => {
          try {
            // Determine transaction type
            const isRefund =
              (txn.amount &&
                (typeof txn.amount === "string"
                  ? txn.amount.startsWith("-")
                  : txn.amount < 0)) ||
              (txn.description &&
                txn.description.toLowerCase().includes("refund"));

            // Extract package fields if populated
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
            // Return a fallback transaction object if processing fails
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "debit_card":
        return "Debit Card";
      case "upi":
        return "UPI";
      case "net_banking":
        return "Net Banking";
      case "wallet":
        return "Wallet";
      default:
        return method;
    }
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
        // Always create a new order, the backend will handle if it's a retry
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

        // Open Razorpay checkout
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
                // Refresh transactions list
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

          // Show appropriate error message
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

  // Add handleViewDetails function
  const handleViewDetails = (transaction: TransactionItem) => {
    // Implement view details functionality
    console.log("View details for transaction:", transaction);
    // You can add your view details logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            My Transactions
          </h1>
          <p className="text-gray-600 text-lg">
            Track and manage your payment history
          </p>
        </div>

        {/* Main Transactions Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Search and Filters */}
          <div className="p-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-blue-200" />
                </div>
                <input
                  type="text"
                  className="pl-12 pr-4 py-3 w-full bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-blue-100 text-white"
                  placeholder="Search by transaction ID, order ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white min-w-[140px]"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-blue-200" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white min-w-[140px]"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-blue-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volumetric Weight
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.adminTrackingId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.weight !== undefined &&
                      transaction.weight !== null
                        ? `${transaction.weight} ${
                            transaction.weightUnit || "kg"
                          }`
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.dimensions
                        ? `${transaction.dimensions.length} × ${transaction.dimensions.width} × ${transaction.dimensions.height} ${transaction.dimensions.unit}`
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.volumetricWeight
                        ? `${transaction.volumetricWeight} ${
                            transaction.volumetricWeightUnit || "kg"
                          }`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
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

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {transaction.status === "pending" &&
                          transaction.amount > 0 && (
                            <button
                              onClick={() => handlePay(transaction)}
                              className="text-green-600 hover:text-green-900 font-semibold"
                            >
                              Pay
                            </button>
                          )}
                        <button
                          onClick={() => handleViewDetails(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of{" "}
              {localTransactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                disabled
              >
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Transaction Summary
              </h2>
            </div>
            <div className="space-y-4">
              {/* Calculate total payments dynamically */}
              {(() => {
                const totalPayments = filteredTransactions
                  .filter((t) => t.type === "payment")
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                const totalRefunds = filteredTransactions
                  .filter((t) => t.type === "refund")
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                const netAmount = totalPayments - totalRefunds;

                return (
                  <>
                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-gray-700 font-medium">
                        Total Payments
                      </span>
                      <span className="font-bold text-blue-600 text-lg">
                        {formatCurrency(totalPayments)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-gray-700 font-medium">
                        Total Refunds
                      </span>
                      <span className="font-bold text-red-600 text-lg">
                        -{formatCurrency(totalRefunds)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <span className="text-gray-700 font-medium">
                        Net Amount
                      </span>
                      <span className="font-bold text-green-700 text-xl">
                        {formatCurrency(netAmount)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Payment Methods
              </h2>
            </div>
            <div className="space-y-4">
              {/* Calculate payment methods dynamically */}
              {(() => {
                // Group transactions by payment method and calculate totals
                const paymentMethods = filteredTransactions
                  .filter(
                    (t) => t.type === "payment" && t.status === "completed"
                  )
                  .reduce((acc, t) => {
                    const method = t.paymentMethod || "other";
                    acc[method] = (acc[method] || 0) + Math.abs(t.amount);
                    return acc;
                  }, {} as Record<string, number>);

                // Define the order of payment methods to display
                const methodOrder = [
                  "credit_card",
                  "upi",
                  "net_banking",
                  "wallet",
                  "other",
                ];

                const methodResults = methodOrder
                  .filter((method) => paymentMethods[method] > 0)
                  .map((method) => (
                    <div
                      key={method}
                      className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <span className="text-gray-700 font-medium">
                        {getPaymentMethodLabel(method)}
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(paymentMethods[method])}
                      </span>
                    </div>
                  ));

                return methodResults.length > 0 ? (
                  methodResults
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No completed payments yet</p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
