import { RentalStatus, RentalType } from "@/types/enums";

export const rentalTypeLabels: Record<RentalType, string> = {
	[RentalType.APARTMENT]: "Appartement",
	[RentalType.STUDIO]: "Studio",
	[RentalType.SINGLE_ROOM]: "Chambre",
	[RentalType.STORE]: "Boutique", //"Commerce",
	[RentalType.VILLA]: "Villa",
};

export const rentalStatusLabels: Record<RentalStatus, string> = {
	[RentalStatus.AVAILABLE]: "Vacant",
	[RentalStatus.BOOKED]: "Réservé",
	[RentalStatus.MAINTENANCE]: "Maintenance",
	[RentalStatus.OCCUPIED]: "Loué",
};
