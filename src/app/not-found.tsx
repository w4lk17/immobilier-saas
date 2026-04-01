"use client";

import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
							<FileQuestion className="h-8 w-8 text-orange-600" />
						</div>
					</div>
					<CardTitle className="text-2xl">Page Non Trouvée</CardTitle>
					<CardDescription>
						Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col gap-2">
						<Button asChild className="w-full">
							<Link href="/">
								<Home className="mr-2 h-4 w-4" />
								Retour à l&apos;accueil
							</Link>
						</Button>
						<Button asChild variant="outline" className="w-full">
							<Link href="#" onClick={() => window.history.back()}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Retour en arrière
							</Link>
						</Button>
					</div>

					<div className="pt-4 border-t">
						<p className="text-xs text-center text-muted-foreground">
							Vérifiez l&apos;URL ou contactez le support si le problème persiste.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
