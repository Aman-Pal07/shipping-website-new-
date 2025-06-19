import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifyEmailUpdate, requestEmailUpdate } from "@/services/authService";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCredentials, getCurrentUser } from "@/features/auth/authSlice";
import api from "@/lib/axios";

interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneNumber?: string;
  createdAt?: Date;
}


export default function UserPersonalDetails() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Get auth state with loading status
  const {
    user,
    token,
    isAuthenticated,
    status,
    error: authError,
  } = useSelector((state: RootState) => state.auth);

  // Local state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [userDataFetched, setUserDataFetched] = useState(false);

  // Memoized user data to prevent unnecessary re-renders
  const userData = useMemo((): UserData => {
    if (!user) {
      return {
        firstName: "",
        lastName: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phoneNumber: "",
      };
    }

    // Handle both cases: user object with username or firstName/lastName
    const nameParts = (user as any).username
      ? (user as any).username.split(" ")
      : [];

    return {
      firstName: (user as any).firstName || nameParts[0] || "",
      lastName: (user as any).lastName || nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      addressLine1: (user as any).addressLine1 || "",
      addressLine2: (user as any).addressLine2 || "",
      city: (user as any).city || "",
      state: (user as any).state || "",
      pincode: (user as any).pincode || "",
      phoneNumber: (user as any).phoneNumber || "",
      createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    };
  }, [user]);

  // Local editable state for address form
  const [editableUserData, setEditableUserData] = useState<UserData>(userData);

  // Update editable data when userData changes
  useEffect(() => {
    setEditableUserData(userData);
  }, [userData]);

  // Memoized loading state
  const isLoading = useMemo(() => {
    return (
      status === "loading" || (!user && isAuthenticated && !userDataFetched)
    );
  }, [status, user, isAuthenticated, userDataFetched]);

  // User data fetching with proper conditions and caching
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUserData = async () => {
      // Skip if we already have user data or a request is in progress
      if (!isAuthenticated || user?._id || status === "loading" || userDataFetched) {
        return;
      }

      try {
        const storedUser = localStorage.getItem('userData');
        
        // If we have a stored user, use it first
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (isMounted) {
              dispatch(setCredentials({ user: parsedUser, token: localStorage.getItem('token') || '' }));
              return;
            }
          } catch (e) {
            console.error('Error parsing stored user data', e);
            localStorage.removeItem('userData');
          }
        }

        // Only fetch from API if we don't have the data
        if (isMounted) {
          await dispatch(getCurrentUser()).unwrap();
          setUserDataFetched(true);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        if (isMounted) {
          setUserDataFetched(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated, user?._id, dispatch, status, userDataFetched]);

  // Show auth errors
  useEffect(() => {
    if (authError) {
      toast({
        title: "Error",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, toast]);

  // Address change handler
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditableUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Save address handler
  const handleSaveAddress = useCallback(async () => {
    console.log("Save address button clicked");
    try {
      console.log("isAuthenticated:", isAuthenticated);
      console.log("token exists:", !!token);
      console.log("user:", user); // Log the entire user object to check its structure

      if (!isAuthenticated || !token) {
        console.error("User not authenticated or token missing");
        throw new Error("Please log in to update your address");
      }

      const userId = user?.id || user?._id;

      if (!userId) {
        console.error("User ID not available in user object:", user);
        throw new Error(
          "User information is not available. Please refresh the page."
        );
      }

      setIsUpdating(true);
      console.log("Sending update request with data:", {
        firstName: editableUserData.firstName,
        lastName: editableUserData.lastName,
        addressLine1: editableUserData.addressLine1,
        addressLine2: editableUserData.addressLine2,
        city: editableUserData.city,
        state: editableUserData.state,
        pincode: editableUserData.pincode,
        phoneNumber: editableUserData.phoneNumber,
      });

      // Use the axios instance from our config
      const url = `/users/${userId}`;
      console.log("API URL:", url);

      const { data } = await api.put(url, {
        firstName: editableUserData.firstName,
        lastName: editableUserData.lastName,
        addressLine1: editableUserData.addressLine1,
        addressLine2: editableUserData.addressLine2,
        city: editableUserData.city,
        state: editableUserData.state,
        pincode: editableUserData.pincode,
        phoneNumber: editableUserData.phoneNumber,
      });

      console.log("API Response:", data);

      // Update user in Redux store
      const updatedUser = { ...user, ...data };
      dispatch(setCredentials({ user: updatedUser, token }));

      setIsEditingAddress(false);
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, token, user, editableUserData, dispatch, toast]);

  // Email update handler
  const handleEmailUpdate = useCallback(async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      if (!showOtpField) {
        // Request OTP
        await requestEmailUpdate({ email: newEmail });
        setShowOtpField(true);
        toast({
          title: "Verification Sent",
          description: `We've sent a verification code to ${newEmail}`,
        });
      } else {
        // Verify OTP and update email
        await verifyEmailUpdate({ email: newEmail, otp });

        if (user && token) {
          // Update user in Redux store
          const updatedUser = { ...user, email: newEmail };
          dispatch(setCredentials({ user: updatedUser, token }));

          setShowOtpField(false);
          setIsEditingEmail(false);
          setOtp("");
          setNewEmail("");

          toast({
            title: "Email Updated",
            description: "Your email has been updated successfully",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [newEmail, showOtpField, otp, user, token, dispatch, toast]);

  // Cancel email update
  const cancelEmailUpdate = useCallback(() => {
    setNewEmail("");
    setOtp("");
    setShowOtpField(false);
    setIsEditingEmail(false);
  }, []);

  // Format date helper
  const formatDate = useCallback((date?: Date) => {
    if (!date) return "N/A";
    try {
      return format(date, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  }, []);

  // Cancel address editing
  const cancelAddressEdit = useCallback(() => {
    setEditableUserData(userData); // Reset to original data
    setIsEditingAddress(false);
  }, [userData]);

  // Start email editing
  const startEmailEdit = useCallback(() => {
    setNewEmail(userData.email);
    setIsEditingEmail(true);
  }, [userData.email]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                First Name
              </Label>
              <div className="mt-1 text-base">
                {userData.firstName || "Not provided"}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Last Name
              </Label>
              <div className="mt-1 text-base">
                {userData.lastName || "Not provided"}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-500">
                  Email
                </Label>
                {!isEditingEmail && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startEmailEdit}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Update
                  </Button>
                )}
              </div>
              {isEditingEmail ? (
                <div className="space-y-3 mt-2">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={showOtpField || isUpdating}
                    placeholder="Enter new email address"
                  />
                  {showOtpField && (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        disabled={isUpdating}
                      />
                      <p className="text-sm text-gray-500">
                        We've sent a verification code to {newEmail}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleEmailUpdate}
                      disabled={
                        isUpdating || (showOtpField && !otp) || !newEmail
                      }
                    >
                      {isUpdating
                        ? "Processing..."
                        : showOtpField
                        ? "Verify OTP"
                        : "Send Verification"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEmailUpdate}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-base">
                  {userData.email || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Account Created
              </Label>
              <div className="mt-1 text-base">
                {formatDate(userData.createdAt)}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Address</h3>
              {!isEditingAddress ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingAddress(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {userData.addressLine1 ? "Edit Address" : "Add Address"}
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelAddressEdit}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAddress}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            {!isEditingAddress ? (
              <div className="space-y-2">
                {userData.addressLine1 ? (
                  <div className="space-y-1">
                    <p className="text-base">{userData.addressLine1}</p>
                    {userData.addressLine2 && (
                      <p className="text-base">{userData.addressLine2}</p>
                    )}
                    <p className="text-base">
                      {[userData.city, userData.state, userData.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {userData.phoneNumber && (
                      <p className="text-base">Phone: {userData.phoneNumber}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No address provided</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="addressLine1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address Line 1 *
                  </Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={editableUserData.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="addressLine2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={editableUserData.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={editableUserData.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State/Province *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={editableUserData.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP/Postal Code *
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={editableUserData.pincode}
                      onChange={handleAddressChange}
                      placeholder="Postal code"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={editableUserData.phoneNumber}
                    onChange={handleAddressChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
