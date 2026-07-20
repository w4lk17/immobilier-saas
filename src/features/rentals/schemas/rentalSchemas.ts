import { z } from "zod";
import { RentalStatus, RentalType } from "@/types/enums";

export const rentalCreateSchema = z.object({
	propertyId: z.number().int().positive("La propriété est requise."),
	name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
	type: z.nativeEnum(RentalType, { required_error: "Le type de locatif est requis." }),
	status: z.nativeEnum(RentalStatus).optional(),
	roomCount: z.coerce
		.number({ invalid_type_error: "Le nombre de pièces doit être un nombre." })
		.int()
		.min(0, "Le nombre de pièces ne peut pas être négatif."),
	rentalValue: z.coerce
		.number({ invalid_type_error: "Le loyer doit être un nombre." })
		.min(0, "Le loyer ne peut pas être négatif."),
	charges: z.coerce
		.number({ invalid_type_error: "Les charges doivent être un nombre." })
		.min(0, "Les charges ne peuvent pas être négatives."),
	surface: z.coerce
		.number({ invalid_type_error: "La surface doit être un nombre." }),
	isFurnished: z.boolean(),
});

export type RentalFormData = z.infer<typeof rentalCreateSchema>;
