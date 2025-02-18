export interface LoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
}

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch extends BaseEntity {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Customer extends BaseEntity {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Shipment extends BaseEntity {
  senderId: string;
  receiverId: string;
  sourceBranchId: string;
  destinationBranchId: string;
  content: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  timestamp: string;
}

export interface ShipmentTracking extends BaseEntity {
  shipmentId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  location: string;
  notes?: string;
  timestamp: string;
}

export interface Vehicle extends BaseEntity {
  plateNumber: string;
  type: 'TRUCK' | 'VAN' | 'MOTORCYCLE';
  capacity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  branchId: string;
} 