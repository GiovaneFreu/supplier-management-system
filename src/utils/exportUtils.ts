import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Supplier, ExportOptions } from '../types/supplier';

export class ExportService {
  static exportToExcel(suppliers: Supplier[], options: ExportOptions = { format: 'xlsx', includeAddress: true }) {
    const data = this.prepareData(suppliers, options);
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns
    const cols = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = cols;
    
    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFFFF" } }
      };
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    
    const fileName = `suppliers_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
  
  static exportToCSV(suppliers: Supplier[], options: ExportOptions = { format: 'csv', includeAddress: true }) {
    const data = this.prepareData(suppliers, options);
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = `suppliers_export_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  }
  
  static exportToJSON(suppliers: Supplier[], options: ExportOptions = { format: 'json', includeAddress: true }) {
    const data = this.prepareData(suppliers, options);
    const jsonString = JSON.stringify(data, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const fileName = `suppliers_export_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  }
  
  private static prepareData(suppliers: Supplier[], options: ExportOptions) {
    return suppliers.map(supplier => {
      const baseData = {
        'ID': supplier.id,
        'Company Name': supplier.companyName,
        'Trade Name': supplier.tradeName || '',
        'Tax ID': supplier.taxId,
        'Email': supplier.email,
        'Phone': supplier.phone,
        'Category': supplier.category,
        'Status': supplier.status,
        'Rating': supplier.rating,
        'Created At': supplier.createdAt.toLocaleDateString(),
        'Updated At': supplier.updatedAt.toLocaleDateString()
      };
      
      if (options.includeAddress) {
        return {
          ...baseData,
          'Street': supplier.address.street,
          'Number': supplier.address.number,
          'Complement': supplier.address.complement || '',
          'Neighborhood': supplier.address.neighborhood,
          'City': supplier.address.city,
          'State': supplier.address.state,
          'Zip Code': supplier.address.zipCode,
          'Country': supplier.address.country
        };
      }
      
      return baseData;
    });
  }
  
  static export(suppliers: Supplier[], format: 'xlsx' | 'csv' | 'json', options: Partial<ExportOptions> = {}) {
    const fullOptions: ExportOptions = {
      format,
      includeAddress: true,
      ...options
    };
    
    switch (format) {
      case 'xlsx':
        this.exportToExcel(suppliers, fullOptions);
        break;
      case 'csv':
        this.exportToCSV(suppliers, fullOptions);
        break;
      case 'json':
        this.exportToJSON(suppliers, fullOptions);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}