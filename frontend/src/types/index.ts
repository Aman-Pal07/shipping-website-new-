// Package type definition
export interface Package {
  id: string;
  trackingId: string;
  description?: string;
  status: string;
  weight?: number;
  weightUnit?: string;
  destinationAddress?: string;
  originAddress?: string;
  estimatedDelivery?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
