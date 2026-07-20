"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RentalStatus, RentalType } from "@/types/enums";
import { rentalCreateSchema, RentalFormData } from "../schemas/rentalSchemas";
import { rentalStatusLabels, rentalTypeLabels } from "../lib/rentalLabels";
import { Rental } from "@/types";

interface RentalFormProps {
	propertyId?: number;
	initialData?: Rental | null;
	onSubmit: (data: RentalFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	propertiesForSelection?: { id: number; name: string | null; address: string }[];
}

export function RentalForm({
	propertyId,
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer le local",
	propertiesForSelection,
}: RentalFormProps) {
	const isEditMode = !!initialData;

	const form = useForm<RentalFormData>({
		resolver: zodResolver(rentalCreateSchema),
		defaultValues: isEditMode && initialData ? {
			propertyId: initialData.propertyId,
			name: initialData.name || "",
			type: initialData.type || RentalType.STUDIO,
			status: initialData.status || RentalStatus.AVAILABLE,
			roomCount: initialData.roomCount || 1,
			surface: (initialData as any).surface || 0,
			isFurnished: (initialData as any).isFurnished || false,
			rentalValue: initialData.rentalValue || 0,
			charges: initialData.charges || 0,
		} : {
			propertyId: propertyId || (propertiesForSelection?.length === 1 ? propertiesForSelection[0].id : undefined) as any,
			name: "",
			type: RentalType.STUDIO,
			status: RentalStatus.AVAILABLE,
			roomCount: 1,
			surface: 0,
			isFurnished: false,
			rentalValue: 0,
			charges: 0,
		},
	});

	const handleSubmit = async (data: RentalFormData) => {
		await onSubmit(data);
	};

	const showPropertySelect = !propertyId && propertiesForSelection && propertiesForSelection.length > 0;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				{showPropertySelect && (
					<FormField
						control={form.control}
						name="propertyId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Propriété associée <span className="text-red-500">*</span>
								</FormLabel>
								<Select
									onValueChange={(val) => field.onChange(parseInt(val, 10))}
									defaultValue={field.value ? String(field.value) : undefined}
									disabled={isEditMode}
								>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner une propriété" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{propertiesForSelection.map((prop) => (
											<SelectItem key={prop.id} value={String(prop.id)}>
												{prop.name ? `${prop.name} (${prop.address})` : prop.address}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Référence du Local <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Ex. Appartement 00, Chambre 00, " {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Type de local <span className="text-red-500">*</span>
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl className="w-full">
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner un type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(RentalType).map((type) => (
										<SelectItem key={type} value={type}>
											{rentalTypeLabels[type]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isFurnished"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Le local est-il meublé&nbsp;?</FormLabel>
							<Select
								onValueChange={(val) => field.onChange(val === "true")}
								defaultValue={field.value === true ? "true" : "false"}
							>
								<FormControl className="w-full">
									<SelectTrigger>
										<SelectValue placeholder="Sélectionner une option" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem key="false" value="false">Non</SelectItem>
									<SelectItem key="true" value="true">Oui</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{isEditMode && (
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Statut</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner un statut" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(RentalStatus).map((status) => (
											<SelectItem key={status} value={status}>
												{rentalStatusLabels[status]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="surface"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Superficie (m²)</FormLabel>
							<FormControl>
								<Input type="number" min={0} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="roomCount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre de pièces</FormLabel>
							<FormControl>
								<Input type="number" min={0} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="rentalValue"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Loyer <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input type="number" min={0} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="charges"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Charges sur loyer</FormLabel>
							<FormControl>
								<Input type="number" min={0} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full mt-5" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{submitButtonText}
				</Button>
			</form>
		</Form>
	);
}
