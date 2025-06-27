export interface Dimensions {
  width?: number;
  height?: number;
  length?: number;
  unit?: string;
}

export interface Package {
  id: string; // Local ID for frontend
  _id?: string; // MongoDB ObjectId from backend
  trackingId: string;
  adminTrackingId?: string; // Admin tracking ID
  userId: number | {
    _id: string;
    email: string;
    name?: string;
  };
  weight: string;
  weightUnit?: string;
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  content?: string; // Added content field
  dimensions?: Dimensions;
  status:
    | "waiting"
    | "in_transit"
    | "india"
    | "dispatch"
    | "delivered"
    | "completed";
  currentLocation?: string;
  destinationAddress: string;
  estimatedDelivery?: Date;
  priority: "standard" | "express" | "overnight";
  amount?: number; // Amount set by admin, optional
  isPaid?: boolean; // Whether package has been paid for
  isCompleted?: boolean; // Whether the package is in completed transactions
  completedAt?: string; // When the package was marked as completed
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageWithCustomer extends Package {
  customer?: {
    name: string;
    email: string;
    initials: string;
  };
}

export interface CreatePackageData {
  trackingId?: string;
  customerEmail: string;
  weight: number;
  weightUnit: "kg" | "lbs" | "g";
  destinationAddress: string;
  estimatedDelivery?: string;
  priority: "standard" | "express" | "overnight";
  content?: string; // Added content field
}

export interface UpdatePackageData {
  weight?: string;
  volumetricWeight?: number;
  volumetricWeightUnit?: string;
  status?: string;
  currentLocation?: string;
  destinationAddress?: string;
  estimatedDelivery?: Date;
  priority?: string;
  amount?: number; // Allow updating amount
  isPaid?: boolean; // Allow updating payment status
  trackingId?: string; // Allow updating tracking ID
}

export interface PackageStats {
  total: number;
  waiting: number;
  inTransit: number;
  india: number;
  dispatch: number;
  delivered: number;
}
