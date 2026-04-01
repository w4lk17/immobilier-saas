"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { UserCreateSchema, UserUpdateSchema, UserCreateFormData, UserUpdateFormData } from '../schemas/userSchemas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FrontendUser } from '@/types';
import { UserRole } from '@/types/enums';

interface UserFormProps {
	initialData?: FrontendUser | null;
	onSubmit: (data: UserCreateFormData | UserUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
}

const ROLE_OPTIONS = [
	{ value: "ADMIN", label: "Administrateur" },
	{ value: "EMPLOYEE", label: "Employé" },
	{ value: "OWNER", label: "Propriétaire" },
	{ value: "TENANT", label: "Locataire" },
	{ value: "USER", label: "Utilisateur" },
];

export function UserForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer utilisateur",
}: UserFormProps) {
	const isEditMode = !!initialData;
	const schema = isEditMode ? UserUpdateSchema : UserCreateSchema;
	// Type safety: use correct type based on mode
	const form = useForm<any>({
		resolver: zodResolver(schema as any),
		defaultValues: isEditMode && initialData ? {
			email: initialData.email,
			role: initialData.role,
			firstName: initialData.firstName || '',
			lastName: initialData.lastName || '',
		} : {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
		},
	});

	const handleSubmit = async (data: UserCreateFormData | UserUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditMode ? "Modifier utilisateur" : "Créer nouvel utilisateur"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="utilisateur@example.com"
												type="email"
												disabled={isEditMode}
												{...field}
												value={field.value || ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!isEditMode && (
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mot de passe</FormLabel>
											<FormControl>
												<Input
													placeholder="Min. 8 caractères"
													type="password"
													{...field}
													value={field.value || ''}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl>
											<Input
												placeholder='Doe'
												{...field}
												value={field.value || ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl>
											<Input placeholder='John'
												{...field}
												value={field.value || ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{isEditMode && (
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rôle</FormLabel>
										<Select onValueChange={field.onChange} value={field.value || ''}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionner un rôle" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{ROLE_OPTIONS.map((role) => (
													<SelectItem key={role.value} value={role.value}>
														{role.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<div className="flex justify-end gap-4 pt-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{submitButtonText}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
