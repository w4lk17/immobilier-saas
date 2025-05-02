"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../schemas/authSchemas';
import { Button } from "@/components/ui/button"; // Import Shadcn components
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '../hooks/useAuth'; // Import the auth hook
import { useState } from 'react';

export function LoginForm() {
	const { login, isLoading } = useAuth(); // Use the login function from the hook
	// const [error, setError] = useState<string | null>(null); // Alternative error handling

	const form = useForm<LoginCredentials>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginCredentials) {
		// setError(null); // Reset error on new submit
		await login(values); // Call the login function from useAuth
		// Error handling is done within the useAuth hook using toast
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* Optional: Display general form error state here */}
				{/* {error && <p className="text-sm font-medium text-destructive">{error}</p>} */}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="votre@email.com" {...field} type="email" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mot de passe</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? 'Connexion...' : 'Se connecter'}
				</Button>
			</form>
		</Form>
	);
}