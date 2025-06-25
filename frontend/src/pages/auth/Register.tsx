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
    password: "",
    confirmPassword: "",
    documents: [
      { documentType: "PAN Card", file: null, preview: null },
      { documentType: "Aadhar Card", file: null, preview: null },
    ],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize two document fields (run only once)
  useEffect(() => {
    if (formData.documents.length !== 2) {
      setFormData((prev) => ({
        ...prev,
        documents: [
          { documentType: "PAN Card", file: null, preview: null },
          { documentType: "Aadhar Card", file: null, preview: null },
        ],
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Check if exactly two documents are uploaded
    const validDocuments = formData.documents.filter((doc) => doc.file);
    if (validDocuments.length !== 2) {
      alert("Please upload exactly two documents");
      return;
    }

    // Check if document types are unique
    const docTypes = formData.documents.map((doc) => doc.documentType);
    if (new Set(docTypes).size !== docTypes.length) {
      alert("Document types must be unique");
      return;
    }

    try {
      // Create RegisterData object with all documents
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        documents: validDocuments.map((doc) => ({
          documentType: doc.documentType,
          file: doc.file!,
          preview: doc.preview || "",
        })),
      };

      console.log("Submitting registration with data:", {
        email: registerData.email,
        documentCount: registerData.documents.length,
        documentTypes: registerData.documents.map((d) => d.documentType),
      });

      const result = await dispatch(registerUser(registerData));

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
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
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
      formData.documents.length === 2 &&
      formData.documents.every((doc) => doc.file) &&
      new Set(formData.documents.map((doc) => doc.documentType)).size === 2
    );
  };

  const isPasswordValid = formData.password.length >= 8;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LiaTelegramPlane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 mb-6">
            Sign up to get started with our platform
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("firstName") &&
                      formData.firstName.length > 0 && (
                        <span className="text-xs text-red-500">
                          First name is required
                        </span>
                      )}
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formData.firstName.length > 0 &&
                      !isFieldValid("firstName")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    {!isFieldValid("lastName") &&
                      formData.lastName.length > 0 && (
                        <span className="text-xs text-red-500">
                          Last name is required
                        </span>
                      )}
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formData.lastName.length > 0 && !isFieldValid("lastName")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Upload Documents
                </h3>
                <p className="text-sm text-gray-600">
                  Please upload exactly two different documents for verification
                </p>

                {formData.documents.map((doc, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Document {index + 1}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PAN Card">PAN Card</option>
                      <option value="Aadhar Card">Aadhar Card</option>
                      <option value="Passport">Passport</option>
                    </select>

                    <div className="mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {doc.preview ? (
                        <div className="mt-2 relative">
                          <img
                            src={doc.preview}
                            alt={`Document ${index + 1} preview`}
                            className="h-20 w-auto object-contain border rounded"
                          />
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-red-500">
                          {!doc.file && "Please upload a document"}
                        </p>
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor={`file-upload-${index}`}
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id={`file-upload-${index}`}
                            name={`document-${index}`}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleFileChange(index, e)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {!isFieldValid("email") && formData.email.length > 0 && (
                    <span className="text-xs text-red-500">
                      Please enter a valid email
                    </span>
                  )}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    formData.email.length > 0 && !isFieldValid("email")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  {!isFieldValid("password") &&
                    formData.password.length > 0 && (
                      <span className="text-xs text-red-500">
                        At least 8 characters
                      </span>
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
                    className={`w-full px-4 py-3 pr-12 border ${
                      formData.password.length > 0 && !isFieldValid("password")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div
                      className={`flex items-center text-xs ${
                        isPasswordValid ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isPasswordValid ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      At least 8 characters
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  {!isFieldValid("confirmPassword") &&
                    formData.confirmPassword.length > 0 && (
                      <span className="text-xs text-red-500">
                        Passwords don't match
                      </span>
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
                    className={`w-full px-4 py-3 pr-12 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formData.confirmPassword.length > 0 &&
                      !isFieldValid("confirmPassword")
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {formData.confirmPassword && !passwordsMatch && (
                  <div className="mt-2 flex items-center text-xs text-red-600">
                    <X className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </div>
                )}

                {formData.confirmPassword && passwordsMatch && (
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Passwords match
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Indicates required
                fields
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in here
            </Link>
          </p>

          <p className="text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
