
"use client";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../schemas/authSchemas';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"; 
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react'; // Pour l'indicateur de chargement
import Image from 'next/image';

export function LoginForm() {
	const { login, isLoading } = useAuth();
	// const [error, setError] = useState<string | null>(null); // Gestion d'erreur via toast dans useAuth

	const form = useForm<LoginCredentials>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginCredentials) {
		await login(values);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Structure externe de la carte avec 2 colonnes internes sur md+ */}
			<Card className="overflow-hidden shadow-lg"> {/* Ajout ombre */}
				<CardContent className="grid p-0 md:grid-cols-2">
					{/* Colonne Formulaire (Gauche) */}
					{/* Utilisation du composant Form de Shadcn/RHF */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-6 md:p-8">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold tracking-tight">Re-bonjour !</h1> {/* Texte adapté */}
								<p className="text-balance text-sm text-muted-foreground">
									Connectez-vous à votre compte GestImmo Pro
								</p>
							</div>

							{/* Champs du formulaire gérés par RHF */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" {...field} type="email" />
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
										<div className="flex items-center">
											<FormLabel>Mot de passe</FormLabel>
											<Link
												href="#" // TODO: Mettre en place la logique "mot de passe oublié"
												className="ml-auto text-xs font-medium text-primary underline-offset-4 hover:underline"
											>
												Mot de passe oublié ?
											</Link>
										</div>
										<FormControl>
											<Input placeholder="******" {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isLoading ? 'Connexion...' : 'Se connecter'}
							</Button>

							{/* Séparateur */}
							{/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
								<span className="relative z-10 bg-background px-2 text-muted-foreground">
									Ou continuez avec
								</span>
							</div> */}

							{/* Boutons sociaux omis car non implémentés */}
							{/* <div className="grid grid-cols-2 gap-4">
								<Button variant="outline" className="w-full">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
											fill="currentColor"
										/>
									</svg>
									<span className="sr-only">Login with Apple</span>
								</Button>
								<Button variant="outline" className="w-full">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									<span className="sr-only">Login with Google</span>
								</Button>
							</div> */}
							{/* Fin des boutons sociaux */}
							<div className="text-center text-sm">
								Nouveau chez GestImmo Pro?{" "}
								<Link href="/register" className="underline underline-offset-4">
									Créer un compte
								</Link>
							</div>
						</form>
					</Form>

					{/* Colonne Image (Droite - cachée sur mobile) */}
					<div className="relative hidden items-center justify-center bg-muted md:flex">
						{/* Remplacez par votre image ou gardez un fond */}
						<Image
							src="/dashboard-preview.jpg" // Exemple : nécessite une image dans /public
							alt="Illustration Gestion Immobilière"
							fill // Utilisez fill si vous utilisez next/image et le parent a position relative
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							priority={true}
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale-[50%]"
							// width={800} // Fournir width/height si vous n'utilisez pas fill
							// height={1000}
						/>
						{/* Optionnel: Ajouter une citation par dessus l'image */}
						<div className="relative z-10 m-auto max-w-[80%] rounded-lg bg-black/50 p-6 text-white backdrop-blur-sm">
							<blockquote className="space-y-2">
								<p className="text-lg font-medium">
									&ldquo;La simplicité est la sophistication suprême.&rdquo;
								</p>
								<footer className="text-sm">- Leonardo da Vinci (adapté)</footer>
							</blockquote>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}