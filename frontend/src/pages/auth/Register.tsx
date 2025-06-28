import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { AppDispatch, RootState } from "../../store";
import { registerUser } from "../../features/auth/authSlice";
import { LiaTelegramPlane } from "react-icons/lia";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    documents: Array<{
      documentType: "PAN Card" | "Aadhar Card" | "Passport";
      file: File | null;
      preview: string | null;
    }>;
  }

  const [formData, setFormData] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    documents: [{ documentType: "PAN Card", file: null, preview: null }],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize single document field (run only once)
  useEffect(() => {
    if (formData.documents.length !== 1) {
      setFormData((prev) => ({
        ...prev,
        documents: [{ documentType: "Aadhar Card", file: null, preview: null }],
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Validate phone number
    if (!/^[+]?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      alert("Please enter a valid phone number (10-15 digits, + optional)");
      return;
    }

    // Check if document is uploaded
    const validDocuments = formData.documents.filter((doc) => doc.file);
    if (validDocuments.length === 0) {
      alert("Please upload a document");
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        documents: validDocuments.map((doc) => ({
          documentType: doc.documentType,
          file: doc.file!,
          preview: doc.preview || "",
        })),
      };

      console.log("Submitting registration data:", {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        documentCount: validDocuments.length,
        documentTypes: validDocuments.map((d) => d.documentType),
      });

      const result = await dispatch(registerUser(registrationData));

      if (registerUser.fulfilled.match(result)) {
        const response = result.payload;
        localStorage.setItem("pendingVerificationEmail", formData.email);

        if (response.requiresVerification) {
          navigate("/verify-email", { state: { email: formData.email } });
        } else {
          const redirectPath =
            response.user?.role === "admin" ? "/admin" : "/dashboard";
          navigate(redirectPath);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      // The error will be handled by the authSlice's rejected action
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (50KB to 500KB)
      const minSize = 50 * 1024; // 50KB in bytes
      const maxSize = 500 * 1024; // 500KB in bytes

      if (file.size < minSize) {
        alert(
          "File size is too small. Please upload a file between 50KB and 500KB."
        );
        e.target.value = ""; // Clear the file input
        return;
      }

      if (file.size > maxSize) {
        alert(
          "File size is too large. Please reduce the file size to under 500KB and try again."
        );
        e.target.value = ""; // Clear the file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocuments = [...formData.documents];
        newDocuments[index] = {
          ...newDocuments[index],
          file,
          preview: reader.result as string,
        };
        setFormData({
          ...formData,
          documents: newDocuments,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentTypeChange = (
    index: number,
    value: "PAN Card" | "Aadhar Card" | "Passport"
  ) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = {
      ...newDocuments[index],
      documentType: value,
    };
    setFormData({
      ...formData,
      documents: newDocuments,
    });
  };

  const isFieldValid = (field: string) => {
    switch (field) {
      case "firstName":
        return !!formData.firstName.trim();
      case "lastName":
        return !!formData.lastName.trim();
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case "phoneNumber":
        return /^[+]?[0-9]{10,15}$/.test(formData.phoneNumber);
      case "password":
        return formData.password.length >= 8;
      case "confirmPassword":
        return (
          formData.password === formData.confirmPassword &&
          formData.confirmPassword.length > 0
        );
      default:
        return true;
    }
  };

  const isFormValid = () => {
    return (
      isFieldValid("firstName") &&
      isFieldValid("lastName") &&
      isFieldValid("email") &&
      isFieldValid("password") &&
      isFieldValid("confirmPassword") &&
      formData.documents.length === 1 &&
      formData.documents[0].file !== null
    );
  };

  const isPasswordValid = formData.password.length >= 8;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  return (
    <div
      className="min-h-screen flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605732562084-f528a2154616?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNoaXBwaW5nfGVufDB8MXwwfHx8MA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-lg w-full space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LiaTelegramPlane className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Create Your Account
          </h1>
          <p className="text-white text-sm mb-3">
            Sign up to get started with our platform
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("firstName") &&
                      formData.firstName.length > 0 && (
                        <span className="text-xs text-red-500">Required</span>
                      )}
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formData.firstName.length > 0 &&
                      !isFieldValid("firstName")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("lastName") &&
                      formData.lastName.length > 0 && (
                        <span className="text-xs text-red-500">Required</span>
                      )}
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formData.lastName.length > 0 && !isFieldValid("lastName")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {!isFieldValid("email") && formData.email.length > 0 && (
                    <span className="text-xs text-red-500">Invalid email</span>
                  )}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formData.email.length > 0 && !isFieldValid("email")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {!isFieldValid("phoneNumber") &&
                    formData.phoneNumber.length > 0 && (
                      <span className="text-xs text-red-500">
                        Invalid phone
                      </span>
                    )}
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formData.phoneNumber.length > 0 &&
                    !isFieldValid("phoneNumber")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="+1234567890"
                  pattern="[+]?[0-9]{10,15}"
                  title="Please enter a valid phone number (10-15 digits, + optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("password") &&
                      formData.password.length > 0 && (
                        <span className="text-xs text-red-500">8+ chars</span>
                      )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border ${
                        formData.password.length > 0 &&
                        !isFieldValid("password")
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Confirm <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("confirmPassword") &&
                      formData.confirmPassword.length > 0 && (
                        <span className="text-xs text-red-500">No match</span>
                      )}
                  </div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        formData.confirmPassword.length > 0 &&
                        !isFieldValid("confirmPassword")
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Confirm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password validation indicators */}
              <div className="flex items-center justify-between text-xs">
                <div
                  className={`flex items-center ${
                    isPasswordValid ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {isPasswordValid ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  8+ characters
                </div>
                {formData.confirmPassword && (
                  <div
                    className={`flex items-center ${
                      passwordsMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    Passwords match
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Upload Document <span className="text-red-500">*</span>
                </h3>

                {formData.documents.map((doc, index) => (
                  <div key={index} className="space-y-2">
                    <select
                      value={doc.documentType}
                      onChange={(e) =>
                        handleDocumentTypeChange(
                          index,
                          e.target.value as
                            | "PAN Card"
                            | "Aadhar Card"
                            | "Passport"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="PAN Card">PAN Card</option>
                      <option value="Aadhar Card">Aadhar Card</option>
                      <option value="Passport">Passport</option>
                    </select>

                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e)}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {doc.preview && (
                        <img
                          src={doc.preview}
                          alt={`Document preview`}
                          className="h-10 w-10 object-contain border rounded"
                        />
                      )}
                    </div>
                    {!doc.file && (
                      <p className="text-xs text-red-500">
                        Please upload a document (50KB-500KB)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <span className="text-red-500">*</span> Required fields
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-200 font-semibold"
            >
              Sign in here
            </Link>
          </p>

          <p className="text-xs text-white">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-blue-300 hover:text-blue-200">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-300 hover:text-blue-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
