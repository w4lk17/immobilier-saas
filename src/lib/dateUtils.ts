// src/lib/dateUtils.ts
import { format, formatDistance, isAfter, isBefore, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Convert ISO string or Date to Date object
 */
export function toDate(dateValue?: string | Date | null): Date | null {
	if (!dateValue) return null;
	// Si c'est déjà une Date
	if (dateValue instanceof Date) return dateValue;
	// Sinon on parse la string
	return new Date(dateValue);
}

/**
 * Format ISO string or Date to readable date format
 */
export function formatDate(dateValue?: string | Date | null, formatStr: string = 'PP'): string {
	if (!dateValue) return '';
	try {
		const date = toDate(dateValue);
		return date ? format(date, formatStr, { locale: fr }) : '';
	} catch {
		return '';
	}
}

/**
 * Format ISO string or Date to time only format
 */
export function formatTime(dateValue?: string | Date | null): string {
	if (!dateValue) return '';
	try {
		const date = toDate(dateValue);
		return date ? format(date, 'HH:mm', { locale: fr }) : '';
	} catch {
		return '';
	}
}

/**
 * Format ISO string or Date to date and time
 */
export function formatDateTime(dateValue?: string | Date | null): string {
	if (!dateValue) return '';
	try {
		const date = toDate(dateValue);
		return date ? format(date, 'PPp', { locale: fr }) : '';
	} catch {
		return '';
	}
}

/**
 * Get relative time representation (e.g., '2 hours ago')
 */
export function getRelativeTime(dateValue?: string | Date | null): string {
	if (!dateValue) return '';
	try {
		const date = toDate(dateValue);
		return date
			? formatDistance(date, new Date(), { addSuffix: true, locale: fr })
			: '';
	} catch {
		return '';
	}
}

/**
 * Check if date is in the past
 */
export function isPast(dateValue?: string | Date | null): boolean {
	if (!dateValue) return false;
	try {
		const date = toDate(dateValue);
		return date ? isBefore(date, new Date()) : false;
	} catch {
		return false;
	}
}

/**
 * Check if date is in the future
 */
export function isFuture(dateValue?: string | Date | null): boolean {
	if (!dateValue) return false;
	try {
		const date = toDate(dateValue);
		return date ? isAfter(date, new Date()) : false;
	} catch {
		return false;
	}
}

/**
 * Check if two dates are the same day
 */
export function isSameDayUtil(
	date1?: string | Date | null,
	date2?: string | Date | null
): boolean {
	if (!date1 || !date2) return false;
	try {
		const d1 = toDate(date1);
		const d2 = toDate(date2);
		return (d1 && d2) ? isSameDay(d1, d2) : false;
	} catch {
		return false;
	}
}