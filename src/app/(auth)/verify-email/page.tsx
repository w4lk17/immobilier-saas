"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import authService from "@/features/auth/services/authApi";
import { useMutation } from "@tanstack/react-query";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: verifyEmail, isPending, isError, isSuccess } = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verification du compte
          </h1>
          <p className="text-sm text-muted-foreground">
            Aucun token de verification trouvé dans le lien.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Retour a la connexion</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vérification du compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Validation de votre adresse email...
        </p>
      </div>

      {isPending && (
        <div className="flex items-center justify-center rounded-lg border p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isSuccess && (
        <div className="rounded-lg border border-green-500/60 bg-green-50 px-6 py-5 text-green-900 dark:border-green-500/60 dark:bg-green-950/60 dark:text-green-300 shadow-sm flex flex-col items-center">
          <CardTitle className="text-base mb-2 text-green-900 dark:text-green-300 text-center">
            Compte activé&nbsp;!
          </CardTitle>
          <AlertDescription className="text-green-800 dark:text-green-200 mb-4 text-center">
            Votre email a été vérifié avec succès.
            <br />
            Vous pouvez maintenant vous connecter.
          </AlertDescription>
          <Link href="/login" className="w-full">
            <Button className="w-full" type="button">
              Se connecter
            </Button>
          </Link>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/60 bg-red-50 px-6 py-5 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-300 shadow-sm flex flex-col items-center">
          <CardTitle className="text-base mb-2 text-red-900 dark:text-red-300 text-center">
            Erreur
          </CardTitle>
          <AlertDescription className="text-red-800 dark:text-red-200 mb-4 text-center">
            Le lien de vérification est invalide ou a expiré.
          </AlertDescription>
          <Link href="/login" className="w-full">
            <Button className="w-full" type="button" variant="outline">
              Retour à la connexion
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}