import { Package, User } from "./index";

export interface Dimensions {
  width: number;
  height: number;
  length: number;
  unit: string;
  _id?: string;
}

export interface Transaction {
  _id: string;
  userId: string | User;
  packageId: string | Package;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  description?: string;
  dimensions?: Dimensions;
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  adminTrackingId?: string;
  weight?: number;
  weightUnit?: string;
  packageStatus: 'Processing' | 'Dispatch';
  completedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
}

export interface UpdatePackageStatusPayload {
  id: string;
  packageStatus: 'Processing' | 'Dispatch';
}

export interface CreateTransactionData {
  userId: string;
  packageId: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
    length: number;
    unit: string;
  };
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  adminTrackingId?: string;
  weight?: number;
  weightUnit?: string;
  packageStatus?: 'Processing' | 'Dispatch';
}

export interface UpdateTransactionData {
  status?: string;
  amount?: number | string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  description?: string;
  dimensions?: Omit<Dimensions, '_id'> & {
    width: number | string;
    height: number | string;
    length: number | string;
  };
  width?: number | string;
  height?: number | string;
  length?: number | string;
  unit?: string;
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  weight?: number | string;
  weightUnit?: string;
  adminTrackingId?: string;
  packageStatus?: 'Processing' | 'Dispatch';
}
