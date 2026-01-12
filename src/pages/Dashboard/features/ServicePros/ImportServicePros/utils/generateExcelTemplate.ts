import { utils, writeFile } from 'xlsx';

/**
 * Generates an Excel template file with mock data for service provider import
 */
export function generateServiceProImportTemplate(): void {
  // Define headers
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'Company Name',
    'Category',
    'Street Address',
    'City',
    'State',
    'Zip Code',
    'Country',
    'Status'
  ];

  // Example 1: Active Service Pro
  const activePro: Record<string, any> = {
    'First Name': 'Mike',
    'Last Name': 'Builder',
    'Email': 'mike@builders.com',
    'Phone Number': '+15551234567',
    'Company Name': 'Mike\'s Repairs',
    'Category': 'Plumbing',
    'Street Address': '123 Fix It Lane',
    'City': 'Repairville',
    'State': 'CA',
    'Zip Code': '90210',
    'Country': 'USA',
    'Status': 'Active'
  };

  // Example 2: Inactive Service Pro
  const inactivePro: Record<string, any> = {
    'First Name': 'Sarah',
    'Last Name': 'Electric',
    'Email': 'sarah@sparks.com',
    'Phone Number': '+15559876543',
    'Company Name': 'Sparks Fly Electric',
    'Category': 'Electrical',
    'Street Address': '456 Voltage Way',
    'City': 'Circuit City',
    'State': 'TX',
    'Zip Code': '75001',
    'Country': 'USA',
    'Status': 'Inactive'
  };

  // Create data array with headers and examples
  const row1 = headers.map(header => activePro[header] ?? '');
  const row2 = headers.map(header => inactivePro[header] ?? '');
  
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
    if (activePro[header]) maxWidth = Math.max(maxWidth, String(activePro[header]).length);
    if (inactivePro[header]) maxWidth = Math.max(maxWidth, String(inactivePro[header]).length);
    return { wch: Math.min(Math.max(maxWidth + 2, 10), 30) }; 
  });
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'ServicePros');

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const fileName = `ServicePro_Import_Template_${date}.xlsx`;

  // Save file
  writeFile(wb, fileName);
}
