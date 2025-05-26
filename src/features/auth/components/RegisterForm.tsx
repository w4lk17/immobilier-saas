
"use client";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterCredentials } from '../schemas/authSchemas';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Import direct du service user pour register
import usersService from '@/features/users/services/usersApi';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export function RegisterForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null); // Pour afficher une erreur générale

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
		setIsLoading(true);
		setError(null);
		try {
			await usersService.register(values);
			toast.success("Inscription réussie ! Veuillez vous connecter.");
			router.push('/login'); // Rediriger vers login après inscription
		} catch (err: any) {
			console.error('Registration failed:', err);
			const errMsg = err.response?.data?.message || "Échec de l'inscription. Vérifiez les informations ou réessayez.";
			setError(errMsg); // Afficher l'erreur dans le formulaire
			// Le toast peut être redondant si on affiche l'erreur dans le formulaire
			// toast.error(errMsg);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden shadow-lg">
				<CardContent className="grid p-0 md:grid-cols-2">
					{/* Colonne Formulaire (Gauche) */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 md:p-8"> {/* Réduit gap */}
							<div className="flex flex-col items-center text-center mb-2"> {/* Réduit margin bottom */}
								<h1 className="text-2xl font-bold tracking-tight">Créez votre compte</h1>
								<p className="text-balance text-sm text-muted-foreground">
									Rejoignez GestImmo Pro
								</p>
							</div>

							{error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* Grid pour Prénom/Nom */}
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem className="space-y-1">
											<FormLabel>Nom</FormLabel>
											<FormControl>
												<Input placeholder="Dupont" {...field} />
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
												<Input placeholder="Jean" {...field} />
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
											<Input placeholder="********" {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full mt-2" disabled={isLoading}> {/* Ajout mt-2 */}
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isLoading ? 'Inscription...' : "S'inscrire"}
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
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</ div>
	);
}