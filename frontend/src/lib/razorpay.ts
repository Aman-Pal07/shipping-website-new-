import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load the Razorpay SDK script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If Razorpay is already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      toast.error('Failed to load payment gateway. Please try again later.');
      resolve(false);
    };

    // Add script to document
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay checkout
 * @param options Razorpay options
 * @returns Promise that resolves with payment details on success or rejects on failure
 */
export const initializeRazorpayCheckout = (options: {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}): Promise<{
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}> => {
  return new Promise(async (resolve, reject) => {
    // Ensure Razorpay SDK is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      reject(new Error('Failed to load Razorpay SDK'));
      return;
    }

    // Create Razorpay instance
    const razorpay = new window.Razorpay({
      ...options,
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        resolve(response);
      },
    });

    // Add event handlers
    razorpay.on('payment.failed', function (response: any) {
      reject({
        error: true,
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        payment_id: response.error.metadata.payment_id,
        order_id: response.error.metadata.order_id,
      });
    });

    // Open Razorpay checkout
    razorpay.open();
  });
};

/**
 * Process payment with Razorpay
 * @param orderId Razorpay order ID
 * @param amount Amount in paise (smallest currency unit)
 * @param currency Currency code (default: INR)
 * @param keyId Razorpay key ID
 * @param userInfo Optional user information for prefilling
 * @returns Promise that resolves with payment details on success
 */
export const processRazorpayPayment = async (
  orderId: string,
  amount: number,
  keyId: string,
  currency: string = 'INR',
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  }
) => {
  try {
    // Initialize Razorpay checkout
    const response = await initializeRazorpayCheckout({
      key: keyId,
      amount: amount,
      currency: currency,
      name: 'Shipping Website',
      description: 'Payment for shipping services',
      order_id: orderId,
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
        contact: userInfo?.phone,
      },
      theme: {
        color: '#3399cc',
      },
    });

    return response;
  } catch (error) {
    console.error('Razorpay payment failed:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment on the client side
 * @param orderId Razorpay order ID
 * @param paymentId Razorpay payment ID
 * @param signature Razorpay signature
 * @param transactionId Our internal transaction ID
 * @returns Promise that resolves with verification result
 */
export const verifyRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string,
  transactionId: string
) => {
  try {
    console.log('Verifying payment with:', { orderId, paymentId, signature, transactionId });
    
    // Import axios instance to ensure consistent configuration
    const api = (await import('../lib/axios')).default;
    
    // First verify the payment with Razorpay
    const verifyResponse = await api.post('/payments/verify', {
      orderId,
      paymentId,
      signature,
      transactionId,
    });

    console.log('Payment verification response:', verifyResponse.data);
    
    // If verification is successful, update the transaction
    if (verifyResponse.data.success || verifyResponse.data.status === 'success') {
      try {
        // Import transaction API
        const { transactionAPI } = await import('../features/transactions/transactionAPI');
        
        // Update the transaction with payment details
        const updateResponse = await transactionAPI.updateTransaction(transactionId, {
          status: 'completed',
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          paymentMethod: 'razorpay'
        });
        
        console.log('Transaction update response:', updateResponse);
        
        // Return combined data
        return {
          ...verifyResponse.data,
          transaction: updateResponse
        };
      } catch (updateError) {
        console.error('Error updating transaction after verification:', updateError);
        // Still return success since payment was verified
        return verifyResponse.data;
      }
    }
    
    return verifyResponse.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};
