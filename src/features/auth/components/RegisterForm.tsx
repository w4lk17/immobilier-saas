"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RegisterCredentials, RegisterSchema } from "../schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
	const searchParams = useSearchParams();
	const { register: registerUser } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const planFromUrl = searchParams.get("plan") || "basic";

	const form = useForm<RegisterCredentials>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			companyName: "",
			planSlug: planFromUrl,
		},
	});

	useEffect(() => {
		const plan = searchParams.get("plan");
		if (plan) {
			form.setValue("planSlug", plan);
		}
	}, [searchParams, form]);

	const onSubmit = async (data: RegisterCredentials) => {
		setError(null);
		try {
			await registerUser(data);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Une erreur est survenue lors de la creation du compte";
			setError(message);
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center lg:text-left">
				<h1 className="text-2xl font-semibold tracking-tight">Creer votre compte</h1>
				<p className="text-sm text-muted-foreground">
					Rejoignez Hofeti et demarrez votre gestion immobiliere.
				</p>
				{/* <p className="text-xs text-muted-foreground">
					Plan selectionne:{" "}
					<span className="font-semibold uppercase">{form.watch("planSlug")}</span>
				</p> */}
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Entreprise / Organisation</FormLabel>
								<FormControl>
									<Input
										placeholder="Ex: Mon Agence Immobiliere"
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input placeholder="Dupont" {...field} value={field.value || ""} />
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
										<Input placeholder="Jean" {...field} value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="votre@email.com" {...field} />
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
									<Input type="password" placeholder="********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Inscription...
							</>
						) : (
							"S inscrire"
						)}
					</Button>
				</form>
			</Form>

			<div className="space-y-4">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-2 text-muted-foreground">Ou</span>
					</div>
				</div>

				<Button variant="outline" className="w-full" asChild>
					<Link href="/login">Se connecter</Link>
				</Button>
			</div>
		</div>
	);
}