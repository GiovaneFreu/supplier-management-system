import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Code2, Settings, CheckCircle, Users, Database } from 'lucide-react';
import { useSupplierStore } from '../store/supplierStore';
import { ExportService } from '../utils/exportUtils';
import type { ExportOptions } from '../types/supplier';

export function ExportControls() {
  const { filteredSuppliers, selectedSuppliers } = useSupplierStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'xlsx',
    includeAddress: true
  });

  const suppliersToExport = selectedSuppliers.length > 0 
    ? filteredSuppliers.filter(s => selectedSuppliers.includes(s.id))
    : filteredSuppliers;

  const handleExport = async (format: 'xlsx' | 'csv' | 'json') => {
    if (suppliersToExport.length === 0) {
      return;
    }

    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      await ExportService.export(suppliersToExport, format, exportOptions);
      setExportSuccess(format.toUpperCase());
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats = [
    {
      format: 'xlsx' as const,
      label: 'Excel',
      icon: FileSpreadsheet,
      description: 'Spreadsheet with formatting',
      recommended: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      format: 'csv' as const,
      label: 'CSV',
      icon: FileText,
      description: 'Comma-separated values',
      recommended: false,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      format: 'json' as const,
      label: 'JSON',
      icon: Code2,
      description: 'Developer-friendly format',
      recommended: false,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <Download className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <p className="text-sm text-gray-500">
            Download your supplier data in various formats
          </p>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedSuppliers.length > 0 ? (
              <>
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Selected suppliers: {selectedSuppliers.length}
                </span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  All filtered suppliers: {filteredSuppliers.length}
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Export options</span>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              checked={exportOptions.includeAddress}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                includeAddress: e.target.checked
              }))}
            />
            Include complete address information
          </label>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-3">Choose format:</div>
        <div className="space-y-2">
          {exportFormats.map(({ format, label, icon: Icon, description, recommended, color, bgColor, hoverColor }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              disabled={isExporting || suppliersToExport.length === 0}
              className={`w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg ${hoverColor} transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden`}
            >
              {recommended && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className={`p-3 rounded-lg ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              
              <div className="flex-1 text-left">
                <div className="text-base font-semibold text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              
              {exportSuccess === format.toUpperCase() && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      {isExporting && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Preparing your export...
            </p>
            <p className="text-xs text-blue-700">
              Processing {suppliersToExport.length} suppliers
            </p>
          </div>
        </div>
      )}

      {exportSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">
              Export completed successfully!
            </p>
            <p className="text-xs text-green-700">
              Your {exportSuccess} file has been downloaded
            </p>
          </div>
        </div>
      )}

      {suppliersToExport.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            No suppliers to export. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}