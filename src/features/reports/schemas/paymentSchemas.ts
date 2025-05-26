
import { z } from 'zod';
import { PaymentType, PaymentStatus } from '@/types/enums';

// Schéma pour la création (généralement par Admin/Employee)
export const paymentCreateSchema = z.object({
	contractId: z.number({ required_error: "L'ID du contrat est requis." }).int().positive(),
	tenantId: z.number({ required_error: "L'ID du locataire est requis." }).int().positive(), // Redondant mais utile pour validation croisée potentielle
	amount: z.coerce.number({ required_error: "Le montant est requis.", invalid_type_error: "Le montant doit être un nombre." }).min(0),
	type: z.nativeEnum(PaymentType, { required_error: "Le type de paiement est requis." }),
	dueDate: z.coerce.date({
		required_error: "La date d'échéance est requise.",
		invalid_type_error: "Format de date d'échéance invalide.",
	}),
	status: z.nativeEnum(PaymentStatus).optional(), // Le backend a une valeur par défaut (PENDING)
	paidDate: z.coerce.date({ invalid_type_error: "Format de date de paiement invalide." }).optional().nullable(),
});

export type PaymentFormData = z.infer<typeof paymentCreateSchema>;

// Schéma pour la mise à jour (généralement juste status et paidDate)
export const paymentUpdateSchema = z.object({
	status: z.nativeEnum(PaymentStatus, { required_error: "Le statut est requis." }), // Rendre requis pour l'update ? Ou optionnel?
	paidDate: z.coerce.date({ invalid_type_error: "Format de date de paiement invalide." }).optional().nullable(),
	// Si le statut est PAID, paidDate devient souvent requis (peut être géré par .refine ou logique de formulaire)
}).refine(data => {
	// Exemple de validation croisée : si le statut est PAID, paidDate doit être défini
	if (data.status === PaymentStatus.PAID && !data.paidDate) {
		return false;
	}
	return true;
}, {
	message: "La date de paiement est requise lorsque le statut est 'Payé'.",
	path: ["paidDate"], // Indique quel champ est concerné par l'erreur
});


export type UpdatePaymentFormData = z.infer<typeof paymentUpdateSchema>;