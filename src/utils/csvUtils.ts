
import Papa from 'papaparse';

/**
 * Parse CSV string data to JSON objects
 * @param csvData CSV string to parse
 * @param config Configuration options for Papa.parse
 * @returns Parsed data as array of objects
 */
export const parseCsv = (
  csvData: string, 
  config: Papa.ParseConfig = { header: true, skipEmptyLines: true }
): any[] => {
  const results = Papa.parse(csvData, config);
  
  if (results.errors && results.errors.length > 0) {
    console.error("CSV parsing errors:", results.errors);
  }
  
  return results.data as any[];
};

/**
 * Convert JSON objects to CSV string
 * @param data Array of objects to convert to CSV
 * @param config Configuration options for Papa.unparse
 * @returns CSV string
 */
export const convertToCsv = (
  data: any[], 
  config: Papa.UnparseConfig = {}
): string => {
  return Papa.unparse(data, config);
};

/**
 * Download CSV data as a file
 * @param data CSV string or array of objects
 * @param filename Name for the downloaded file
 */
export const downloadCsv = (data: string | any[], filename: string = 'export.csv'): void => {
  const csvData = typeof data === 'string' ? data : convertToCsv(data);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download URL
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add link to document, trigger download, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
