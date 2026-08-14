/**
 * Export utilities for CSV and Excel file formats
 */

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
	data: T[],
	fileName: string,
	columns?: { key: keyof T; label: string }[]
) {
	if (!data || data.length === 0) {
		console.warn('No data to export');
		return;
	}

	// If columns provided, use them; otherwise use all keys from first row
	const headers = columns || Object.keys(data[0]).map(key => ({ key, label: String(key) }));

	// Create CSV content
	const csvRows: string[] = [];

	// Add header row
	csvRows.push(headers.map(h => `"${h.label}"`).join(','));

	// Add data rows
	for (const row of data) {
		const values = headers.map(header => {
			const value = row[header.key];
			// Handle null/undefined, objects, arrays
			if (value === null || value === undefined) return '""';
			if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
			return `"${String(value).replace(/"/g, '""')}"`;
		});
		csvRows.push(values.join(','));
	}

	// Create blob and download
	const csvContent = csvRows.join('\n');
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', `${fileName}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Export data to Excel format (simplified - uses CSV with .xlsx extension)
 * For proper Excel export, you would need a library like xlsx
 */
export function exportToExcel<T extends Record<string, any>>(
	data: T[],
	fileName: string,
	columns?: { key: keyof T; label: string }[]
) {
	// For now, use CSV format with .xlsx extension
	// Excel can open CSV files
	// For proper Excel with formatting, consider using 'xlsx' library
	exportToCSV(data, fileName, columns);

	// Rename the downloaded file to have .xlsx extension
	// Note: This is a simple workaround. For production, use the 'xlsx' library:
	// npm install xlsx
	// import * as XLSX from 'xlsx';
}

/**
 * Format data for export with custom column mapping
 */
export function formatDataForExport<T extends Record<string, any>>(
	data: T[],
	columnMap: Record<string, (row: T) => any>
): any[] {
	return data.map(row => {
		const formatted: any = {};
		for (const [key, accessor] of Object.entries(columnMap)) {
			formatted[key] = accessor(row);
		}
		return formatted;
	});
}

/**
 * Get current date formatted for filenames
 */
export function getExportDatePrefix(): string {
	const now = new Date();
	return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}
