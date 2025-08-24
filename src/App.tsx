import { useSupplierStore } from './store/supplierStore';
import { SupplierFilters } from './components/SupplierFilters';
import { SupplierTable } from './components/SupplierTable';
import { ExportControls } from './components/ExportControls';
import { EmptyState } from './components/EmptyState';
import { Building2, Users, TrendingUp, Package, ArrowUp, ArrowDown } from 'lucide-react';

function App() {
  const { filteredSuppliers, selectedSuppliers, suppliers, isLoading } = useSupplierStore();
  
  const stats = [
    {
      name: 'Total Suppliers',
      value: filteredSuppliers.length,
      total: suppliers.length,
      icon: Building2,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      ringColor: 'ring-blue-200',
      change: filteredSuppliers.length === suppliers.length ? 0 : filteredSuppliers.length - suppliers.length,
      trend: 'neutral'
    },
    {
      name: 'Selected',
      value: selectedSuppliers.length,
      total: filteredSuppliers.length,
      icon: Users,
      color: 'text-emerald-700', 
      bgColor: 'bg-emerald-50',
      ringColor: 'ring-emerald-200',
      change: 0,
      trend: 'neutral'
    },
    {
      name: 'Active Suppliers',
      value: filteredSuppliers.filter(s => s.status === 'Active').length,
      total: suppliers.filter(s => s.status === 'Active').length,
      icon: TrendingUp,
      color: 'text-violet-700',
      bgColor: 'bg-violet-50',
      ringColor: 'ring-violet-200',
      change: +2,
      trend: 'up'
    },
    {
      name: 'Categories',
      value: new Set(filteredSuppliers.map(s => s.category)).size,
      total: new Set(suppliers.map(s => s.category)).size,
      icon: Package,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      ringColor: 'ring-amber-200',
      change: 0,
      trend: 'neutral'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading suppliers...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Supplier Management
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Manage and export your supplier data with advanced filtering and reporting capabilities
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Live Data</span>
            </div>
          </div>
          
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div 
                key={stat.name} 
                className={`group relative bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ${stat.ringColor} ring-1`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                      {stat.total !== stat.value && (
                        <p className="text-xs text-gray-500">of {stat.total.toLocaleString()} total</p>
                      )}
                    </div>
                  </div>
                  
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center space-x-1 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(stat.change)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="animate-fade-in">
            <SupplierFilters />
          </div>
          
          {filteredSuppliers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-slide-up">
              <div className="xl:col-span-3">
                <SupplierTable />
              </div>
              <div className="xl:col-span-1">
                <div className="sticky top-32">
                  <ExportControls />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Built with React 19.1, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>© 2024 Supplier Management System</span>
              <span>•</span>
              <span>Version 2.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
