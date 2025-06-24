import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmail,
  resendVerificationCode,
} from "../../features/auth/authSlice";
import { AppDispatch, RootState } from "../../store";
import { toast } from "react-hot-toast";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Get email from location state or localStorage
  const email =
    location.state?.email ||
    localStorage.getItem("pendingVerificationEmail") ||
    "";

  useEffect(() => {
    // If no email to verify, redirect to login
    if (!email) {
      navigate("/login");
      return;
    }

    // Save email to localStorage for persistence
    localStorage.setItem("pendingVerificationEmail", email);
  }, [email, navigate]);

  // Separate useEffect for authentication check to prevent infinite loops
  useEffect(() => {
    // If user is already verified, redirect to appropriate page
    if (isAuthenticated && user && user.isVerified) {
      const redirectPath = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Focus the first input on component mount
    const firstInput = document.getElementById("code-0");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = verificationCode.join("");
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    setIsSubmitting(true);

    try {
      // The result will include token and role from the server
      const result = await dispatch(
        verifyEmail({ email, verificationCode: code })
      ).unwrap();

      // Clear verification email from storage
      localStorage.removeItem("pendingVerificationEmail");

      // Token and role are already stored in localStorage by the verifyEmail thunk
      // Show success message
      toast.success("Email verified successfully!");

      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        const redirectPath = result.role === "admin" ? "/admin" : "/dashboard";
        window.location.replace(redirectPath);
      }, 800); // Short delay to allow the toast to be seen
    } catch (err) {
      toast.error(error || "Verification failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await dispatch(resendVerificationCode(email));
      toast.success("A new verification code has been sent to your email");
    } catch (err) {
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: animate-in 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .slide-in-from-top-2 {
          animation: slideInFromTop 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-8px);
          }
          to {
            transform: translateY(0);
          }
        }
      `,
        }}
      />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 fade-in">
        <div className="text-center slide-in-from-top-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <form className="mt-6 space-y-5 animate-in" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center space-x-3">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-14 rounded-lg border border-gray-200 text-center text-xl font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Resend code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
