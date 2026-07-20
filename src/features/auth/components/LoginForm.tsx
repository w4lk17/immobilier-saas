"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LoginCredentials, LoginSchema } from "../schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";
import { PasswordInput } from "@/components/shared/password-input";
import PhoneInput from "react-phone-number-input"

export function LoginForm() {
	const searchParams = useSearchParams();
	const verificationSent = searchParams.get("verificationSent");
	const { login } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginCredentials>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginCredentials) {
		setError(null);
		try {
			await login(values);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Une erreur est survenue lors de la connexion";
			setError(message);
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center lg:text-left">
				<h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
				<p className="text-sm text-muted-foreground">
					Connectez-vous a votre compte Hofeti.
				</p>
			</div>

			{verificationSent && (
				<Alert className="border-green-500/50 bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300">
					<MailCheck className="h-4 w-4" />
					<AlertTitle>Email envoyé</AlertTitle>
					<AlertDescription>
						Un lien de vérification a été envoyé à votre adresse email.
					</AlertDescription>
				</Alert>
			)}

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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="m@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Téléphone</FormLabel>
								<FormControl>
									<Input type="phone" placeholder="+22890000000" {...field} /> */}
									{/* <PhoneInput
										placeholder="+22890000000"
										country="TG"
										value={field.value}
										onChange={field.onChange}
										inputProps={{
											name: field.name,
											onBlur: field.onBlur,
										}}
									/> */}
								{/* </FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center">
									<FormLabel>Mot de passe</FormLabel>
									<Link
										href="/forgot-password"
										className="ml-auto text-xs font-medium text-primary underline-offset-4 hover:underline"
									>
										Mot de passe oublié ?				
									</Link>
								</div>
								<FormControl>
									<PasswordInput placeholder="********"  {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Connexion...
							</>
						) : (
							"Se connecter"
						)}
					</Button>
				</form>
			</Form>

			<p className="text-center text-sm text-muted-foreground lg:text-left">
				Nouveau chez Hofeti ?{" "}
				<Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
					Créer un compte
				</Link>
			</p>
		</div>
	);
}