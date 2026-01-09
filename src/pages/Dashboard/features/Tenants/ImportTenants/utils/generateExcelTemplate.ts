import { utils, writeFile } from 'xlsx';

/**
 * Generates an Excel template file with mock data for tenant import
 */
export function generateTenantImportTemplate(): void {
  // Define headers
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'Property Name',
    'Unit Name',
    'Lease Start Date',
    'Lease End Date',
    'Rent Amount',
    'Security Deposit',
    'Payment Frequency',
    'Status'
  ];

  // Example 1: Active Tenant
  const activeTenant: Record<string, any> = {
    'First Name': 'John',
    'Last Name': 'Doe',
    'Email': 'john.doe@example.com',
    'Phone Number': '+15551234567',
    'Property Name': 'Sunset Apartments',
    'Unit Name': 'Unit 4B',
    'Lease Start Date': '2025-01-01',
    'Lease End Date': '2025-12-31',
    'Rent Amount': 1200.00,
    'Security Deposit': 1200.00,
    'Payment Frequency': 'MONTHLY',
    'Status': 'ACTIVE'
  };

  // Example 2: Prospective Tenant
  const prospectiveTenant: Record<string, any> = {
    'First Name': 'Jane',
    'Last Name': 'Smith',
    'Email': 'jane.smith@example.com',
    'Phone Number': '+15559876543',
    'Property Name': 'Downtown Lofts',
    'Unit Name': 'Loft 101',
    'Lease Start Date': '',
    'Lease End Date': '',
    'Rent Amount': '',
    'Security Deposit': '',
    'Payment Frequency': '',
    'Status': 'PROSPECTIVE'
  };

  // Create data array with headers and examples
  const row1 = headers.map(header => activeTenant[header] ?? '');
  const row2 = headers.map(header => prospectiveTenant[header] ?? '');
  
  const data = [
    headers,
    row1,
    row2,
  ];

  // Create worksheet from array of arrays
  const ws = utils.aoa_to_sheet(data);

  // Set column widths
  const colWidths = headers.map((header) => {
    let maxWidth = header.length;
    if (activeTenant[header]) maxWidth = Math.max(maxWidth, String(activeTenant[header]).length);
    if (prospectiveTenant[header]) maxWidth = Math.max(maxWidth, String(prospectiveTenant[header]).length);
    return { wch: Math.min(Math.max(maxWidth + 2, 10), 30) }; 
  });
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Tenants');

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const fileName = `Tenant_Import_Template_${date}.xlsx`;

  // Save file
  writeFile(wb, fileName);
}
