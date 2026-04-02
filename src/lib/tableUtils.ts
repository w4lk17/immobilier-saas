/**
 * Default search columns for each entity type
 * Used when no specific search column is provided
 */
export const DEFAULT_SEARCH_COLUMNS: Record<string, string[]> = {
	users: ['name', 'email', 'phone'],
	managers: ['name', 'email', 'phone'],
	properties: ['address', 'name', 'reference'],
	contracts: ['tenantName', 'propertyName', 'reference'],
	payments: ['tenantName', 'paymentRef', 'method'],
	expenses: ['description', 'property', 'category'],
	tenants: ['name', 'email', 'phone'],
	owners: ['name', 'email', 'phone'],
	documents: ['name', 'type'],
};

/**
 * Get search columns for a given entity
 */
export function getSearchColumns(entityType: string, customColumns?: string[]): string[] {
	if (customColumns && customColumns.length > 0) {
		return customColumns;
	}
	return DEFAULT_SEARCH_COLUMNS[entityType] || [];
}

/**
 * Multi-column search filter function
 */
export function globalFilterFn<TData extends Record<string, any>>(
	row: TData,
	searchValue: string,
	searchColumns?: string[]
): boolean {
	if (!searchValue) return true;

	const columns = searchColumns || Object.keys(row);

	return columns.some((column) => {
		const value = row[column];
		if (value === null || value === undefined) return false;
		return String(value)
			.toLowerCase()
			.trim()
			.includes(searchValue.toLowerCase().trim());
	});
}

/**
 * Format table cell value for display
 */
export function formatCellValue(value: any): string {
	if (value === null || value === undefined) return '-';
	if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
	if (typeof value === 'number') return value.toLocaleString('fr-FR');
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

/**
 * Generate a unique ID for table rows
 */
export function generateRowId(prefix: string, index: number): string {
	return `${prefix}-${index}-${Date.now()}`;
}
