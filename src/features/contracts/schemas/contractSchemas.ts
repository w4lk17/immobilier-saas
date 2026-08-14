import { z } from "zod";
import { ContractStatus, LeaseType } from "@/types/enums";

const positiveInt = (message: string) =>
	z.coerce.number({ invalid_type_error: message }).int().positive(message);

const nonNegativeNumber = (requiredMessage: string, minMessage: string) =>
	z.coerce
		.number({
			required_error: requiredMessage,
			invalid_type_error: requiredMessage,
		})
		.min(0, minMessage);

export const contractCreateSchema = z.object({
	ownerId: positiveInt("L'identifiant du proprietaire est requis."),
	propertyId: positiveInt("La propriete est requise."),
	rentalId: positiveInt("Le local est requis."),
	tenantId: positiveInt("L'identifiant du locataire est requis."),
	managerId: z.coerce.number().int().positive().nullable().optional(),

	rentDeposit: z.coerce
		.number({
			required_error: "La caution est requise.",
			invalid_type_error: "La caution doit être inférieure ou égale à 3."
		}).max(3)
		.default(3),

	rentAdvance: z.coerce
		.number({
			required_error: "L'avance est requise.",
			invalid_type_error: "L'avance est requise.",
		})
		.max(3, "L'avance doit être inférieure ou égale à 3."),

	rentAmount: z.coerce
		.number({
			required_error: "Le montant du loyer est requis.",
			invalid_type_error: "Le montant du loyer est requis.",
		}),

	chargesAmount: nonNegativeNumber(
		"Le montant des charges est requis.",
		"Le montant des charges doit etre superieur ou egal a 0."
	),

	startDate: z.string().min(1, "La date de debut est requise."),
	endDate: z.string().optional().nullable(),
	dayAddToPaymentDay: z.coerce
		.number({
			required_error: "Le jour d'échéance est requis.",
			invalid_type_error: "Le jour d'échéance est requis.",
		})
		.int()
		.min(0, "L'échéance de paiement doit etre superieur ou egal a 0."),
	paymentStartAfter: z.coerce
		.number({
			required_error: "Le debut du paiement est requis.",
			invalid_type_error: "Le debut du paiement est requis.",
		})
		.int()
		.min(0, "Le debut du paiement doit etre superieur ou egal a 1."),

	leaseType: z.nativeEnum(LeaseType, {
		required_error: "Le type de bail est requis.",
		invalid_type_error: "Le type de bail est invalide.",
	}),
	status: z.nativeEnum(ContractStatus).default(ContractStatus.PENDING),
	pdfUrl: z.string().nullable().optional(),
	depositAmount: z.coerce.number().min(0).optional().nullable(),
	advanceAmount: z.coerce.number().min(0).optional().nullable(),
});

export const contractUpdateSchema = contractCreateSchema.partial();

export type ContractFormData = z.infer<typeof contractCreateSchema>;
export type ContractUpdateFormData = z.infer<typeof contractUpdateSchema>;
