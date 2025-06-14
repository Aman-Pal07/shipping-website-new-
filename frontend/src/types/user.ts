export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  role: string;
  isVerified: boolean;
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
