export interface UserDocument {
  documentType: "PAN Card" | "Aadhar Card" | "Passport";
  documentImage: string;
  uploadedAt?: Date;
  _id?: string;
}

export interface User {
  _id?: string;
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: string;
  isVerified: boolean;
  documents?: UserDocument[];
  // Keeping these for backward compatibility
  documentType?: "PAN Card" | "Aadhar Card" | "Passport";
  documentImage?: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  razorpayCustomerId?: string | null;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  documentType: "PAN Card" | "Aadhar Card" | "Passport";
  documentImage: File;
  role?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  documentType?: "PAN Card" | "Aadhar Card" | "Passport";
  documentImage?: File | string;
}
