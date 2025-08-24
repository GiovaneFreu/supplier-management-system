import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Tag } from 'lucide-react';
import { useSupplierStore } from '../store/supplierStore';
import { SupplierCategory, SupplierStatus } from '../types/supplier';

export function SupplierFilters() {
  const { filters, setFilters, clearFilters, filteredSuppliers, suppliers } = useSupplierStore();
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchValue || undefined });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue, setFilters]);

  const handleCategoryChange = (value: string) => {
    setFilters({ 
      category: value === '' ? undefined : value as SupplierCategory 
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ 
      status: value === '' ? undefined : value as SupplierStatus 
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.status;
  const activeFilterCount = [filters.search, filters.category, filters.status].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Suppliers</h3>
            <p className="text-sm text-gray-500">
              {filteredSuppliers.length} of {suppliers.length} suppliers shown
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Clear filters
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>
      
      {/* Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            Search
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Company name, email, tax ID..."
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-gray-400"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            Category
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all hover:border-gray-400"
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {Object.values(SupplierCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="relative">
            <select
              className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all hover:border-gray-400"
              value={filters.status || ''}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">All Status</option>
              {Object.values(SupplierStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Search: "{filters.search}"
              <button
                onClick={() => {
                  setSearchValue('');
                  setFilters({ search: undefined });
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              {filters.category}
              <button
                onClick={() => setFilters({ category: undefined })}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {filters.status}
              <button
                onClick={() => setFilters({ status: undefined })}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}