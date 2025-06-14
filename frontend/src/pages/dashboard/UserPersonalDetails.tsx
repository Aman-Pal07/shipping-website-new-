import { useEffect, useState } from "react";
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
import { setCredentials } from "@/features/auth/authSlice";

export default function UserPersonalDetails() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: Date;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    createdAt: undefined,
  });

  useEffect(() => {
    if (user) {
      // Handle both cases: user object with username or firstName/lastName
      const nameParts = (user as any).username
        ? (user as any).username.split(" ")
        : [];

      setUserData({
        firstName: (user as any).firstName || nameParts[0] || "",
        lastName: (user as any).lastName || nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
      });
      setLoading(false);
    }
  }, [user]);

  const handleEmailUpdate = async () => {
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

        if (user) {
          // Update user in Redux store
          const updatedUser = { ...user, email: newEmail };
          // Get the token from localStorage since it's not part of the user object
          const token = localStorage.getItem("token") || "";
          dispatch(setCredentials({ user: updatedUser, token }));

          // Update local state
          setUserData((prev) => ({ ...prev, email: newEmail }));
          setShowOtpField(false);
          setIsEditingEmail(false);
          setOtp("");

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
  };

  const cancelEmailUpdate = () => {
    setNewEmail("");
    setOtp("");
    setShowOtpField(false);
    setIsEditingEmail(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    try {
      return format(date, "PPP"); // e.g., "January 1, 2023"
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (loading) {
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
              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  {!isEditingEmail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewEmail(userData.email);
                        setIsEditingEmail(true);
                      }}
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
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Account Created
              </Label>
              <div className="mt-1 text-base">
                {userData.createdAt ? formatDate(userData.createdAt) : "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
