import { z } from "zod";
import { ContractStatus, LeaseType } from "@/types/enums";


export const contractCreateSchema = z.object({

	ownerId: z.number().int().positive(),
	propertyId: z.number().int().positive(),
	rentalId: z.number().int().positive(),
	tenantId: z.number().int().positive("L'identifiant du locataire est requis."),
	managerId: z.number().int().positive().nullable().optional(),

	rentDeposit: z.number({ required_error: "La caution est requise." })
		.min(0, "La caution doit etre superieure ou egale a 0."),
	rentAdvance: z.number({ required_error: "L'avance est requise." })
		.min(0, "L'avance doit etre superieure ou egale a 0."),
	rentAmount: z.number({ required_error: "Le montant du loyer est requis." })
		.min(0, "Le montant du loyer doit etre superieur ou egal a 0."),
	chargesAmount: z.number({ required_error: "Le montant des charges est requis." })
		.min(0, "Le montant des charges doit etre superieur ou egal a 0."),

	startDate: z.string().min(1, "La date de debut est requise."),
	endDate: z.string().optional().nullable(),
	dayAddToPaymentDay: z.number({
		required_error: "Le jour d'échéance de paiement est requis.",
	}).int().min(0, "Le decalage du jour de paiement doit etre superieur ou egal a 0."),
	paymentStartAfter: z.number({
		required_error: "Le délai avant début du paiement est requis.",
	}).int().min(0, "Le delai avant debut du paiement doit etre superieur ou egal a 0.").default(1),

	leaseType: z.nativeEnum(LeaseType, {
		required_error: "Le type de bail est requis.",
		invalid_type_error: "Le type de bail est invalide.",
	}),
	status: z.nativeEnum(ContractStatus).default(ContractStatus.PENDING),
	pdfUrl: z.string().nullable().optional(),
	depositAmount: z.number().min(0).optional().nullable(),
	advanceAmount: z.number().min(0).optional().nullable(),
});

export const contractUpdateSchema = contractCreateSchema.partial();

export type ContractFormData = z.infer<typeof contractCreateSchema>;
export type ContractUpdateFormData = z.infer<typeof contractUpdateSchema>;
