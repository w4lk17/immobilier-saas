"use client";

import { Shield, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { getRoleName } from "@/lib/authUtils";

export default function UnauthorizedPage() {
	const { user } = useAuthStore();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
							<Shield className="h-8 w-8 text-red-600" />
						</div>
					</div>
					<CardTitle className="text-2xl">Accès Refusé</CardTitle>
					<CardDescription>
						{user ? (
							<>
								Vous êtes connecté en tant que <span className="font-semibold">{getRoleName(user.role)}</span>,
								mais vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
							</>
						) : (
							<>
								Vous devez être connecté pour accéder à cette page.
							</>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{user ? (
						<>
							<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
								<p className="text-sm text-blue-800">
									<strong>Compte connecté:</strong>
								</p>
								<p className="text-sm text-blue-700 mt-1">
									{user.email}
								</p>
								<p className="text-sm text-blue-700">
									Rôle: {getRoleName(user.role)}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<Button asChild className="w-full">
									<Link href="/login">
										<LogIn className="mr-2 h-4 w-4" />
										Se connecter avec un autre compte
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full">
									<Link href="/">
										<Home className="mr-2 h-4 w-4" />
										Retour à l&apos;accueil
									</Link>
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-2">
							<Button asChild className="w-full">
								<Link href="/login">
									<LogIn className="mr-2 h-4 w-4" />
									Se connecter
								</Link>
							</Button>
							<Button asChild variant="outline" className="w-full">
								<Link href="/">
									<Home className="mr-2 h-4 w-4" />
									Retour à l&apos;accueil
								</Link>
							</Button>
						</div>
					)}

					<div className="pt-4 border-t">
						<p className="text-xs text-center text-muted-foreground">
							Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, contactez votre administrateur système.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
