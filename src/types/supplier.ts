export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const SupplierCategory = {
  TECHNOLOGY: 'Technology',
  CONSTRUCTION: 'Construction', 
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  FINANCE: 'Finance',
  RETAIL: 'Retail',
  MANUFACTURING: 'Manufacturing',
  SERVICES: 'Services',
  OTHER: 'Other'
} as const;

export type SupplierCategory = typeof SupplierCategory[keyof typeof SupplierCategory];

export const SupplierStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive', 
  PENDING: 'Pending',
  SUSPENDED: 'Suspended'
} as const;

export type SupplierStatus = typeof SupplierStatus[keyof typeof SupplierStatus];

export interface Supplier {
  id: string;
  companyName: string;
  tradeName?: string;
  taxId: string;
  email: string;
  phone: string;
  address: Address;
  category: SupplierCategory;
  status: SupplierStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierFilters {
  category?: SupplierCategory;
  status?: SupplierStatus;
  search?: string;
}

export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'json';
  includeAddress: boolean;
  selectedColumns?: string[];
}