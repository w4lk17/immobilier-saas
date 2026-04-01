"use client";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { registerSchema, RegisterCredentials } from '../schemas/authSchemas';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { useAuth } from '../hooks/useAuth';

export function RegisterForm() {
	const { register } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

	const form = useForm<RegisterCredentials>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
		},
	});

	async function onSubmit(values: RegisterCredentials) {
		setError(null);
		setPasswordMatchError(null);
		try {
			await register(values);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription';
			setError(message);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden shadow-lg">
				<CardContent className="grid p-0 md:grid-cols-2">
					{/* Colonne Formulaire (Gauche) */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 md:p-8">
							<div className="flex flex-col items-center text-center mb-2">
								<h1 className="text-2xl font-bold tracking-tight">Créez votre compte</h1>
								<p className="text-balance text-sm text-muted-foreground">
									Rejoignez GestImmo Pro
								</p>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem className="space-y-1">
											<FormLabel>Nom</FormLabel>
											<FormControl>
												<Input
													placeholder="Dupont"
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
										<FormItem className="space-y-1">
											<FormLabel>Prénom</FormLabel>
											<FormControl>
												<Input
													placeholder="Jean"
													{...field}
													value={field.value || ''}
												/>
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
									<FormItem className="space-y-1">
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
									<FormItem className="space-y-1">
										<FormLabel>Mot de passe</FormLabel>
										<FormControl>
											<Input
												placeholder="Au moins 8 caractères"
												{...field}
												type="password"
												onChange={(e) => {
													field.onChange(e);
													setPasswordMatchError(null);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Inscription...
									</>
								) : (
									"S'inscrire"
								)}
							</Button>

							{/* Séparateur et lien Connexion */}
							<div className="relative mt-2"> {/* Ajout mt-2 */}
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Ou
									</span>
								</div>
							</div>

							<Button variant="outline" className="w-full" asChild>
								<Link href="/login">Se connecter</Link>
							</Button>

						</form>
					</Form>

					{/* Colonne Image (Droite - cachée sur mobile) */}
					{/* Peut être la même image ou une autre */}
					<div className="relative hidden items-center justify-center bg-muted md:flex">
						<Image
							src="/placeholder.svg" // Exemple différent: nécessite image dans /public
							alt="Clés de propriété"
							fill
							priority={true}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale-[50%]"
						// width={800}
						// height={1000}
						/>
						<div className="relative z-10 m-auto max-w-[80%] rounded-lg bg-black/50 p-6 text-white backdrop-blur-sm">
							<blockquote className="space-y-2">
								<p className="text-lg font-medium">
									&ldquo;Ouvrez la porte à une gestion immobilière simplifiée.&rdquo;
								</p>
								<footer className="text-sm">- GestImmo Pro</footer>
							</blockquote>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</ div>
	);
}