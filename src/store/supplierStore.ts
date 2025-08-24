import { create } from 'zustand';
import { SupplierCategory, SupplierStatus } from '../types/supplier';
import type { Supplier, SupplierFilters } from '../types/supplier';

interface SupplierState {
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  filters: SupplierFilters;
  selectedSuppliers: string[];
  isLoading: boolean;
  
  // Actions
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  setFilters: (filters: Partial<SupplierFilters>) => void;
  setSelectedSuppliers: (ids: string[]) => void;
  toggleSupplierSelection: (id: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

// Mock data for demonstration
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc.',
    tradeName: 'TechSol',
    taxId: '12.345.678/0001-90',
    email: 'contact@techsol.com',
    phone: '+1-555-0101',
    address: {
      street: 'Main Street',
      number: '123',
      complement: 'Suite 401',
      neighborhood: 'Downtown',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    category: SupplierCategory.TECHNOLOGY,
    status: SupplierStatus.ACTIVE,
    rating: 4.8,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-08-20')
  },
  {
    id: '2',
    companyName: 'BuildRight Construction',
    tradeName: 'BuildRight',
    taxId: '98.765.432/0001-10',
    email: 'info@buildright.com',
    phone: '+1-555-0202',
    address: {
      street: 'Industrial Ave',
      number: '456',
      neighborhood: 'Industrial District',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90015',
      country: 'USA'
    },
    category: SupplierCategory.CONSTRUCTION,
    status: SupplierStatus.ACTIVE,
    rating: 4.5,
    createdAt: new Date('2023-03-22'),
    updatedAt: new Date('2024-08-18')
  },
  {
    id: '3',
    companyName: 'MedCare Supplies Ltd.',
    email: 'orders@medcare.com',
    phone: '+1-555-0303',
    taxId: '11.222.333/0001-44',
    address: {
      street: 'Healthcare Blvd',
      number: '789',
      neighborhood: 'Medical Center',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    category: SupplierCategory.HEALTHCARE,
    status: SupplierStatus.PENDING,
    rating: 4.2,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-08-15')
  },
  {
    id: '4',
    companyName: 'EduTech Resources',
    tradeName: 'EduTech',
    taxId: '55.666.777/0001-88',
    email: 'support@edutech.com',
    phone: '+1-555-0404',
    address: {
      street: 'University Way',
      number: '321',
      complement: 'Building C',
      neighborhood: 'Campus District',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'USA'
    },
    category: SupplierCategory.EDUCATION,
    status: SupplierStatus.INACTIVE,
    rating: 3.9,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-07-30')
  },
  {
    id: '5',
    companyName: 'Financial Partners Corp',
    email: 'business@finpartners.com',
    phone: '+1-555-0505',
    taxId: '77.888.999/0001-55',
    address: {
      street: 'Wall Street',
      number: '100',
      complement: '45th Floor',
      neighborhood: 'Financial District',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      country: 'USA'
    },
    category: SupplierCategory.FINANCE,
    status: SupplierStatus.ACTIVE,
    rating: 4.7,
    createdAt: new Date('2023-06-12'),
    updatedAt: new Date('2024-08-22')
  }
];

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: mockSuppliers,
  filteredSuppliers: mockSuppliers,
  filters: {},
  selectedSuppliers: [],
  isLoading: false,

  setSuppliers: (suppliers) => {
    set({ suppliers, filteredSuppliers: suppliers });
  },

  addSupplier: (supplierData) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      suppliers: [...state.suppliers, newSupplier],
      filteredSuppliers: [...state.filteredSuppliers, newSupplier]
    }));
  },

  updateSupplier: (id, updates) => {
    const updatedSupplier = { ...updates, updatedAt: new Date() };
    
    set((state) => ({
      suppliers: state.suppliers.map(supplier =>
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      ),
      filteredSuppliers: state.filteredSuppliers.map(supplier =>
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      )
    }));
  },

  deleteSupplier: (id) => {
    set((state) => ({
      suppliers: state.suppliers.filter(supplier => supplier.id !== id),
      filteredSuppliers: state.filteredSuppliers.filter(supplier => supplier.id !== id),
      selectedSuppliers: state.selectedSuppliers.filter(selectedId => selectedId !== id)
    }));
  },

  setFilters: (newFilters) => {
    set((state) => {
      const filters = { ...state.filters, ...newFilters };
      return { filters };
    });
    get().applyFilters();
  },

  setSelectedSuppliers: (ids) => {
    set({ selectedSuppliers: ids });
  },

  toggleSupplierSelection: (id) => {
    set((state) => ({
      selectedSuppliers: state.selectedSuppliers.includes(id)
        ? state.selectedSuppliers.filter(selectedId => selectedId !== id)
        : [...state.selectedSuppliers, id]
    }));
  },

  applyFilters: () => {
    const { suppliers, filters } = get();
    
    let filtered = suppliers;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchTerm) ||
        supplier.tradeName?.toLowerCase().includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm) ||
        supplier.taxId.includes(searchTerm)
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(supplier => supplier.category === filters.category);
    }
    
    if (filters.status) {
      filtered = filtered.filter(supplier => supplier.status === filters.status);
    }
    
    set({ filteredSuppliers: filtered });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredSuppliers: state.suppliers
    }));
  }
}));