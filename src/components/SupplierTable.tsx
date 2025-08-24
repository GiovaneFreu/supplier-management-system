import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { useSupplierStore } from '../store/supplierStore';
import { SupplierStatus } from '../types/supplier';
import type { Supplier } from '../types/supplier';

const columnHelper = createColumnHelper<Supplier>();

export function SupplierTable() {
  const { filteredSuppliers, selectedSuppliers, toggleSupplierSelection } = useSupplierStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              checked={selectedSuppliers.includes(row.original.id)}
              onChange={() => toggleSupplierSelection(row.original.id)}
            />
          </div>
        ),
        enableSorting: false,
        size: 50
      }),
      columnHelper.accessor('companyName', {
        header: 'Company',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {row.original.companyName}
            </div>
            {row.original.tradeName && (
              <div className="text-sm text-gray-500 truncate">
                {row.original.tradeName}
              </div>
            )}
          </div>
        ),
        minSize: 200
      }),
      columnHelper.accessor('taxId', {
        header: 'Tax ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
            {getValue()}
          </span>
        ),
        size: 150
      }),
      columnHelper.accessor('email', {
        header: 'Contact',
        cell: ({ row }) => (
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-50 rounded">
                <Mail className="h-3 w-3 text-blue-600" />
              </div>
              <a
                href={`mailto:${row.original.email}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate"
                title={row.original.email}
              >
                {row.original.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-50 rounded">
                <Phone className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">{row.original.phone}</span>
            </div>
          </div>
        ),
        enableSorting: false,
        minSize: 220
      }),
      columnHelper.accessor('address', {
        header: 'Location',
        cell: ({ getValue }) => {
          const address = getValue();
          return (
            <div className="flex items-start gap-2">
              <div className="p-1 bg-orange-50 rounded mt-0.5">
                <MapPin className="h-3 w-3 text-orange-600" />
              </div>
              <div className="text-sm text-gray-600 min-w-0">
                <div className="font-medium truncate">{address.city}, {address.state}</div>
                <div className="text-xs text-gray-500">{address.country}</div>
              </div>
            </div>
          );
        },
        enableSorting: false,
        size: 150
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ getValue }) => {
          const category = getValue();
          const categoryColors = {
            'Technology': 'bg-blue-100 text-blue-800',
            'Construction': 'bg-orange-100 text-orange-800',
            'Healthcare': 'bg-green-100 text-green-800',
            'Education': 'bg-purple-100 text-purple-800',
            'Finance': 'bg-yellow-100 text-yellow-800',
            'Retail': 'bg-pink-100 text-pink-800',
            'Manufacturing': 'bg-indigo-100 text-indigo-800',
            'Services': 'bg-gray-100 text-gray-800',
            'Other': 'bg-gray-100 text-gray-800'
          };
          
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
              {category}
            </span>
          );
        },
        size: 130
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          const statusConfig = {
            [SupplierStatus.ACTIVE]: { 
              bg: 'bg-emerald-100', 
              text: 'text-emerald-800',
              dot: 'bg-emerald-500'
            },
            [SupplierStatus.INACTIVE]: { 
              bg: 'bg-gray-100', 
              text: 'text-gray-800',
              dot: 'bg-gray-500'
            },
            [SupplierStatus.PENDING]: { 
              bg: 'bg-amber-100', 
              text: 'text-amber-800',
              dot: 'bg-amber-500'
            },
            [SupplierStatus.SUSPENDED]: { 
              bg: 'bg-red-100', 
              text: 'text-red-800',
              dot: 'bg-red-500'
            }
          };
          
          const config = statusConfig[status];
          
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
              {status}
            </span>
          );
        },
        size: 110
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: ({ getValue }) => {
          const rating = getValue();
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating % 1 >= 0.5;
          
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= fullStars
                        ? 'text-yellow-400 fill-yellow-400'
                        : star === fullStars + 1 && hasHalfStar
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          );
        },
        size: 120
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Updated',
        cell: ({ getValue }) => {
          const date = getValue();
          const isRecent = (Date.now() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
          
          return (
            <div className="text-sm">
              <div className={`font-medium ${isRecent ? 'text-green-700' : 'text-gray-700'}`}>
                {date.toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        },
        size: 120
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: () => (
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        ),
        enableSorting: false,
        size: 50
      })
    ],
    [selectedSuppliers, toggleSupplierSelection]
  );

  const table = useReactTable({
    data: filteredSuppliers,
    columns,
    state: {
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = filteredSuppliers.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startItem} to {endItem} of {totalItems} suppliers
            </p>
          </div>
          {selectedSuppliers.length > 0 && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {selectedSuppliers.length} selected
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-200/50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <ChevronUp className={`h-3 w-3 transition-colors ${
                            header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-300'
                          }`} />
                          <ChevronDown className={`h-3 w-3 -mt-1 transition-colors ${
                            header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-300'
                          }`} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row, index) => (
              <tr 
                key={row.id} 
                className={`group hover:bg-blue-50/30 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                } ${selectedSuppliers.includes(row.original.id) ? 'bg-blue-50/50' : ''}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced Pagination */}
      <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200/50">
        {/* Mobile Pagination */}
        <div className="flex justify-between items-center sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                value={pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[10, 20, 30, 50].map(size => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(
                  totalPages - 4,
                  Math.max(1, currentPage - 2)
                )) + i;
                
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    className={`inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(totalPages - 1)}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}