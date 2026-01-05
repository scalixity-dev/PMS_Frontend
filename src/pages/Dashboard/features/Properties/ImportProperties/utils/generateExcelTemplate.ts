import { utils, writeFile } from 'xlsx';

/**
 * Generates an Excel template file with mock data for property import
 * Includes examples for both SINGLE and MULTI property types
 * 
 * @throws {Error} When worksheet construction fails (e.g., invalid data format, memory issues)
 * @throws {Error} When workbook creation or sheet appending fails (e.g., invalid sheet name, workbook structure errors)
 * @throws {Error} When file I/O operations fail during writeFile execution (e.g., insufficient disk space, 
 *                 write permissions denied, file system errors, or if the target directory is inaccessible)
 * 
 * @example
 * ```typescript
 * try {
 *   generatePropertyImportTemplate();
 * } catch (error) {
 *   console.error('Failed to generate template:', error);
 *   // Handle error appropriately (e.g., show user notification)
 * }
 * ```
 * 
 * @remarks
 * Callers should wrap calls to generatePropertyImportTemplate in try-catch blocks to handle
 * potential worksheet construction failures, Excel writeFile/IO errors, and other exceptions
 * that may occur during template generation.
 */
export function generatePropertyImportTemplate(): void {
  // Define headers based on EXCEL_STRUCTURE.md
  const headers = [
    // Common fields
    'Property Name',
    'Property Type',
    'Street Address',
    'City',
    'State',
    'Zip Code',
    'Country',
    'Year Built',
    'MLS Number',
    'Size Sqft',
    'Market Rent',
    'Deposit Amount',
    'Description',
    'Cover Photo URL',
    'YouTube URL',
    'Ribbon Type',
    'Ribbon Title',
    'Listing Contact Name',
    'Listing Phone Country Code',
    'Listing Phone Number',
    'Listing Email',
    'Display Phone Publicly',
    'Status',
    // Amenities
    'Parking Type',
    'Laundry Type',
    'Air Conditioning Type',
    'Property Features',
    'Property Amenities',
    // Media
    'Photo URLs',
    'Primary Photo URL',
    'Attachment URLs',
    'Attachment File Types',
    'Attachment Descriptions',
    // Single unit fields
    'Single Beds',
    'Single Baths',
    'Single Market Rent',
    'Single Deposit',
    'Is Manufactured',
    // Multi unit helper
    'Number of Units',
    // Multi unit fields (for up to 3 units as example)
    'Unit 1 Name',
    'Unit 1 Apartment Type',
    'Unit 1 Size Sqft',
    'Unit 1 Beds',
    'Unit 1 Baths',
    'Unit 1 Rent',
    'Unit 1 Deposit',
    'Unit 2 Name',
    'Unit 2 Apartment Type',
    'Unit 2 Size Sqft',
    'Unit 2 Beds',
    'Unit 2 Baths',
    'Unit 2 Rent',
    'Unit 2 Deposit',
    'Unit 3 Name',
    'Unit 3 Apartment Type',
    'Unit 3 Size Sqft',
    'Unit 3 Beds',
    'Unit 3 Baths',
    'Unit 3 Rent',
    'Unit 3 Deposit',
  ];

  // Example 1: SINGLE unit property
  const singleUnitExample: Record<string, any> = {
    'Property Name': 'Sunset Villa',
    'Property Type': 'SINGLE',
    'Street Address': '123 Main Street',
    'City': 'Los Angeles',
    'State': 'CA',
    'Zip Code': '90001',
    'Country': 'US',
    'Year Built': 2020,
    'MLS Number': 'MLS123456',
    'Size Sqft': 2500,
    'Market Rent': 2500.00,
    'Deposit Amount': 2500.00,
    'Description': 'Beautiful single-family home with modern amenities and spacious layout.',
    'Cover Photo URL': 'https://example.com/photos/sunset-villa-cover.jpg',
    'YouTube URL': '',
    'Ribbon Type': 'NONE',
    'Ribbon Title': '',
    'Listing Contact Name': 'John Doe',
    'Listing Phone Country Code': '+1',
    'Listing Phone Number': '5551234567',
    'Listing Email': 'john.doe@example.com',
    'Display Phone Publicly': 'true',
    'Status': 'ACTIVE',
    'Parking Type': 'GARAGE',
    'Laundry Type': 'IN_UNIT',
    'Air Conditioning Type': 'CENTRAL',
    'Property Features': 'Fireplace, Furnished, Internet, Storage',
    'Property Amenities': 'Pool, Gym, Parking',
    'Photo URLs': 'https://example.com/photos/villa1.jpg, https://example.com/photos/villa2.jpg',
    'Primary Photo URL': 'https://example.com/photos/villa-primary.jpg',
    'Attachment URLs': '',
    'Attachment File Types': '',
    'Attachment Descriptions': '',
    'Single Beds': 3,
    'Single Baths': 2.5,
    'Single Market Rent': 2500.00,
    'Single Deposit': 2500.00,
    'Is Manufactured': 'false',
    'Number of Units': '',
    // Multi unit fields empty for single unit
    'Unit 1 Name': '',
    'Unit 1 Apartment Type': '',
    'Unit 1 Size Sqft': '',
    'Unit 1 Beds': '',
    'Unit 1 Baths': '',
    'Unit 1 Rent': '',
    'Unit 1 Deposit': '',
    'Unit 2 Name': '',
    'Unit 2 Apartment Type': '',
    'Unit 2 Size Sqft': '',
    'Unit 2 Beds': '',
    'Unit 2 Baths': '',
    'Unit 2 Rent': '',
    'Unit 2 Deposit': '',
    'Unit 3 Name': '',
    'Unit 3 Apartment Type': '',
    'Unit 3 Size Sqft': '',
    'Unit 3 Beds': '',
    'Unit 3 Baths': '',
    'Unit 3 Rent': '',
    'Unit 3 Deposit': '',
  };

  // Example 2: MULTI unit property
  const multiUnitExample: Record<string, any> = {
    'Property Name': 'Sunset Apartments',
    'Property Type': 'MULTI',
    'Street Address': '456 Oak Avenue',
    'City': 'Los Angeles',
    'State': 'CA',
    'Zip Code': '90002',
    'Country': 'US',
    'Year Built': 2018,
    'MLS Number': 'MLS789012',
    'Size Sqft': 3600, // Total property size
    'Market Rent': '',
    'Deposit Amount': '',
    'Description': 'Modern apartment complex with multiple units, each featuring updated appliances and amenities.',
    'Cover Photo URL': 'https://example.com/photos/sunset-apts-cover.jpg',
    'YouTube URL': '',
    'Ribbon Type': 'CUSTOM',
    'Ribbon Title': 'New Listing',
    'Listing Contact Name': 'Jane Smith',
    'Listing Phone Country Code': '+1',
    'Listing Phone Number': '5559876543',
    'Listing Email': 'jane.smith@example.com',
    'Display Phone Publicly': 'false',
    'Status': 'ACTIVE',
    'Parking Type': 'PRIVATE_LOT',
    'Laundry Type': 'ON_SITE',
    'Air Conditioning Type': 'CENTRAL',
    'Property Features': 'Elevator, Storage, Internet',
    'Property Amenities': 'Pool, Gym, Playground',
    'Photo URLs': 'https://example.com/photos/apt1.jpg, https://example.com/photos/apt2.jpg, https://example.com/photos/apt3.jpg',
    'Primary Photo URL': 'https://example.com/photos/apt-primary.jpg',
    'Attachment URLs': 'https://example.com/docs/lease-template.pdf',
    'Attachment File Types': 'PDF',
    'Attachment Descriptions': 'Standard Lease Agreement',
    // Single unit fields empty for multi unit
    'Single Beds': '',
    'Single Baths': '',
    'Single Market Rent': '',
    'Single Deposit': '',
    'Is Manufactured': '',
    'Number of Units': 3,
    // Multi unit fields
    'Unit 1 Name': 'Unit 1A',
    'Unit 1 Apartment Type': '1BHK',
    'Unit 1 Size Sqft': 800,
    'Unit 1 Beds': 1,
    'Unit 1 Baths': 1,
    'Unit 1 Rent': 1200.00,
    'Unit 1 Deposit': 1200.00,
    'Unit 2 Name': 'Unit 1B',
    'Unit 2 Apartment Type': '2BHK',
    'Unit 2 Size Sqft': 1200,
    'Unit 2 Beds': 2,
    'Unit 2 Baths': 2,
    'Unit 2 Rent': 1800.00,
    'Unit 2 Deposit': 1800.00,
    'Unit 3 Name': 'Unit 2A',
    'Unit 3 Apartment Type': 'Studio',
    'Unit 3 Size Sqft': 600,
    'Unit 3 Beds': 0,
    'Unit 3 Baths': 1,
    'Unit 3 Rent': 900.00,
    'Unit 3 Deposit': 900.00,
  };

  // Create data array with headers and examples
  // Ensure values are in the same order as headers
  const singleUnitRow = headers.map(header => singleUnitExample[header] ?? '');
  const multiUnitRow = headers.map(header => multiUnitExample[header] ?? '');
  
  const data = [
    headers,
    singleUnitRow,
    multiUnitRow,
  ];

  // Create worksheet from array of arrays
  const ws = utils.aoa_to_sheet(data);

  // Set column widths for better readability
  const colWidths = headers.map((header) => {
    // Estimate width based on header length and content
    let maxWidth = header.length;
    // Check example data for this column
    if (singleUnitExample[header] !== undefined && singleUnitExample[header] !== '') {
      maxWidth = Math.max(maxWidth, String(singleUnitExample[header]).length);
    }
    if (multiUnitExample[header] !== undefined && multiUnitExample[header] !== '') {
      maxWidth = Math.max(maxWidth, String(multiUnitExample[header]).length);
    }
    return { wch: Math.min(Math.max(maxWidth + 2, 10), 30) }; // Min 10, Max 30
  });
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Properties');

  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const fileName = `Property_Import_Template_${date}.xlsx`;

  // Save file
  writeFile(wb, fileName);
}

