// src/features/users/components/UserForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { UserUpdateSchema, UserUpdateFormData } from '../schemas/userSchemas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from '@/types';

interface UserFormProps {
	initialData: User;
	onSubmit: (data: UserUpdateFormData) => Promise<void>;
	isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
	const form = useForm<UserUpdateFormData>({
		resolver: zodResolver(UserUpdateSchema),
		// On utilise 'values' pour être réactif si initialData change (ex: rafraîchissement du cache)
		values: {
			firstName: initialData.firstName || '',
			lastName: initialData.lastName || '',
			phoneNumber: initialData.phoneNumber || '',
			address: initialData.address || '',
		}
	});

	return (
		<Card>
			{/* <CardHeader>
				<CardTitle>Correction de l'utilisateur</CardTitle>
				<CardDescription>
					Modifiez les informations de base de ce compte. Le rôle et le mot de passe se gèrent ailleurs.
				</CardDescription>
			</CardHeader> */}
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

						{/* Info: Email affiché mais non modifiable */}
						<div className="space-y-1">
							<label className="text-sm font-medium text-muted-foreground">Email</label>
							<Input value={initialData.email} disabled className="bg-muted border-dashed" />
							<p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié.</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl>
											<Input placeholder="Prénom" {...field} value={field.value ?? ''} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl>
											<Input placeholder="Nom" {...field} value={field.value ?? ''} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Téléphone</FormLabel>
									<FormControl>
										<Input placeholder="+33 6 00 00 00 00" {...field} value={field.value ?? ''} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Adresse</FormLabel>
									<FormControl>
										<Input placeholder="123 Rue Exemple" {...field} value={field.value ?? ''} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-4 pt-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Sauvegarder
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}