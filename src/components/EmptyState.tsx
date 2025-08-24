import { Search, Package, Plus, RefreshCw } from 'lucide-react';
import { useSupplierStore } from '../store/supplierStore';

export function EmptyState() {
  const { filters, clearFilters, suppliers } = useSupplierStore();
  const hasFilters = filters.search || filters.category || filters.status;
  const hasSuppliers = suppliers.length > 0;

  if (!hasSuppliers) {
    return (
      <div className="text-center py-16 px-6">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No suppliers yet
          </h3>
          <p className="text-gray-600 mb-8">
            Get started by adding your first supplier to the system.
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add First Supplier
          </button>
        </div>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="text-center py-16 px-6">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No suppliers match your filters
          </h3>
          <p className="text-gray-600 mb-8">
            Try adjusting your search criteria to find what you're looking for.
          </p>
          <div className="space-y-4">
            <button 
              onClick={clearFilters}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Clear all filters
            </button>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600">
              {filters.search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {filters.category}
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {filters.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}