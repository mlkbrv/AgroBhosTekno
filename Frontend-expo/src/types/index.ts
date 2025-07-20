export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_business_owner: boolean;
  profile_image?: string;
  date_joined: string;
}

export interface CropCategory {
  id: number;
  name: string;
}

export interface Farm {
  id: number;
  name: string;
  description: string;
  image?: string;
  owner: User;
  address: string;
}

export interface Crop {
  id: number;
  name: string;
  category: CropCategory;
  description: string;
  image?: string;
  farm: Farm;
  stock: number;
  predicted_yield?: number;
  price?: number;
  in_stock: boolean;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  image?: string;
  farm: Farm;
  stock: number;
  price?: number;
  is_new: boolean;
  in_stock: boolean;
}

export interface Machinery {
  id: number;
  name: string;
  producer?: string;
  description: string;
  image?: string;
  farm: Farm;
  stock: number;
  price?: number;
  is_new: boolean;
  in_stock: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image?: string;
  farm: Farm;
  stock: number;
  price?: number;
  type: 'crop' | 'item' | 'machinery';
  category?: CropCategory;
  producer?: string;
  predicted_yield?: number;
  is_new?: boolean;
  in_stock: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_business_owner: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
} 