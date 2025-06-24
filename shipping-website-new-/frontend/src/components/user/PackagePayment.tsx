import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Package } from "../../types/package";
import { AppDispatch, RootState } from "../../store";
import { createTransaction } from "../../features/transactions/transactionSlice";
import { updatePackage } from "../../features/packages/packageSlice";
import { formatCurrency } from "../../lib/utils";
import { CreditCard, Check } from "lucide-react";
import {
  loadRazorpayScript,
  processRazorpayPayment,
  verifyRazorpayPayment,
} from "../../lib/razorpay";
import { toast } from "react-toastify";

interface PackagePaymentProps {
  packageItem: Package;
  onSuccess?: () => void;
}

export default function PackagePayment({
  packageItem,
  onSuccess,
}: PackagePaymentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth) || {};

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpay = async () => {
      try {
        await loadRazorpayScript();
        setRazorpayLoaded(true);
      } catch (err) {
        console.error("Failed to load Razorpay:", err);
        setError("Payment gateway failed to load. Please try again later.");
      }
    };

    loadRazorpay();
  }, []);

  // If the package doesn't have an amount set by admin, or is already paid, don't show payment option
  if (!packageItem?.amount) {
    return (
      <div className="p-4 border rounded-md bg-background">
        <p className="text-sm text-muted-foreground">
          No payment required for this package yet.
        </p>
      </div>
    );
  }

  if (packageItem?.isPaid) {
    return (
      <div className="p-4 border rounded-md bg-background">
        <div className="flex items-center text-green-600">
          <Check className="w-4 h-4 mr-2" />
          <span>Payment completed</span>
        </div>
      </div>
    );
  }

  // Create a transaction and get Razorpay order details
  const prepareForPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if we already have a pending transaction for this package
      const { transactionAPI } = await import(
        "../../features/transactions/transactionAPI"
      );

      let transactionData;
      try {
        // Try to get a pending transaction for this package
        if (packageItem.id) {
          const pendingTransaction =
            await transactionAPI.getPendingTransactionForPackage(
              packageItem.id
            );
          if (pendingTransaction) {
            console.log("Found pending transaction:", pendingTransaction);
            transactionData = pendingTransaction;
          }
        }
      } catch (err) {
        console.log("No pending transaction found, will create a new one");
      }

      // If no pending transaction was found, create a new one
      if (!transactionData && user?.id) {
        console.log("Creating new transaction for package", packageItem.id);
        const transactionDataInput = {
          userId: String(user.id), // Ensure userId is a string
          packageId: packageItem.id!,
          amount: packageItem.amount || 0,
          currency: 'INR',
          status: 'pending' as const,
          description: `Insurance for package ${packageItem.trackingId}`,
        };
        transactionData = await dispatch(
          createTransaction(transactionDataInput)
        ).unwrap();
      } else if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get Razorpay order details for this transaction
      console.log(
        `Getting order details for transaction ${transactionData._id}`
      );
      const orderData = await transactionAPI.getTransactionOrderDetails(
        transactionData._id
      );
      console.log("Order details response:", orderData);

      // Store the order and transaction IDs for later use
      setOrderId(orderData.orderId);
      setTransactionId(transactionData._id);

      return orderData;
    } catch (err: any) {
      setError(err.message || "Failed to prepare payment");
      console.error("Error preparing payment:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    const paymentId = response.razorpay_payment_id;
    const signature = response.razorpay_signature;
    try {
      // Verify payment with backend
      const verificationResult = await verifyRazorpayPayment(
        orderId!,
        paymentId,
        signature,
        transactionId!
      );

      if (verificationResult.success) {
        // Update package status to completed and mark as paid
        await dispatch(
          updatePackage({
            id: packageItem.id,
            updates: {
              isPaid: true,
              status: "completed",
            },
          })
        ).unwrap();

        setPaymentSuccess(true);
        toast.success("Payment successful!");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err: any) {
      console.error("Payment verification error:", err);
      setError(err.message || "Payment verification failed");
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  // Handle payment failure
  const handlePaymentError = (error: unknown) => {
    console.error("Razorpay payment failed:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    setError(`Payment failed: ${errorMessage}`);
    toast.error(`Payment failed: ${errorMessage}`);
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway is not loaded yet. Please try again.");
      return;
    }
    
    if (!user?.email) {
      setError("User email is required for payment");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare for payment using existing transaction
      const orderData = await prepareForPayment();

      // Process Razorpay payment
      const response = await processRazorpayPayment(
        orderData.orderId,
        orderData.amount,
        orderData.keyId,
        orderData.currency || "INR",
        {
          name: user?.firstName || "Customer",
          email: user?.email || "",
          phone: "",
        }
      );

      // Handle success
      await handlePaymentSuccess(response);
    } catch (err) {
      handlePaymentError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-background">
      {paymentSuccess ? (
        <div className="flex flex-col items-center text-green-600 py-4">
          <Check className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-medium">Payment Successful!</h3>
          <p className="text-sm text-center mt-2">
            Your payment for package {packageItem.trackingId} has been
            processed.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-4">Package Payment</h3>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Package ID</p>
              <p className="font-medium">{packageItem.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">
                {formatCurrency(packageItem.amount)}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-primary text-white py-3 rounded-md hover:bg-primary/90 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <CreditCard className="w-5 h-5 mr-2" />
            )}
            Pay Now
          </button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure payment processing powered by Razorpay. Your payment
            information is encrypted.
          </p>
        </>
      )}
    </div>
  );
}
