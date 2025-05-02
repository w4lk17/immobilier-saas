"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterCredentials, registerSchema } from "../schemas/authSchemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
	const { register, isLoading } = useAuth();

	const form = useForm<RegisterCredentials>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(values: RegisterCredentials) {
		// setError(null); // Reset error on new submit
		await register(values);
		// Error handling is done within the useAuth hook using toast
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* Optional: Display general form error state here */}
				{/* {error && <p className="text-sm font-medium text-destructive">{error}</p>} */}
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prénom</FormLabel>
							<FormControl>
								<Input placeholder="Prénom" {...field} />
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
								<Input placeholder="Nom" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" {...field} type="email" />
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
								<Input placeholder="********" {...field} type="password" />
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