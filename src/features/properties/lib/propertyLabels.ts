import { PropertyStatus, PropertyType } from "@/types/enums";

export const propertyTypeLabels: Record<PropertyType, string> = {
	// [PropertyType.APARTMENT]: "Appartement",
	[PropertyType.BUILDING]: "Immeuble",
	// [PropertyType.BUNGALOW]: "Bungalow",
	// [PropertyType.DUPLEX]: "Duplex",
	[PropertyType.HOUSE]: "Maison",
	[PropertyType.LAND]: "Terrain",
	[PropertyType.VILLA]: "Villa",
	[PropertyType.OTHER]: "Autre",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
	[PropertyStatus.AVAILABLE]: "Disponible",
	[PropertyStatus.FOR_RENT]: "À louer",
	[PropertyStatus.MAINTENANCE]: "Maintenance",
	[PropertyStatus.UNAVAILABLE]: "Indisponible",
};

export function getPropertyTypeLabel(type: PropertyType | string): string {
	return propertyTypeLabels[type as PropertyType] ?? type;
}

export function getPropertyStatusLabel(status: PropertyStatus | string): string {
	return propertyStatusLabels[status as PropertyStatus] ?? status;
}
