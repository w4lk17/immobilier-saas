"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/shared/password-input";
import {
  ResetPasswordCredentials,
  ResetPasswordSchema,
} from "@/features/auth/schemas/authSchemas";
import { useAuth } from "@/features/auth/hooks/useAuth";
function ResetPasswordForm() {
  const params = useSearchParams();
  const { resetPassword } = useAuth();
  const form = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: params.get("token") || "",
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
      </div>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async ({ token, password }) => {
            try {
              await resetPassword(token, password);
            } catch (e: any) {
              form.setError("token", {
                message:
                  e.response?.data?.message || "Lien invalide ou expiré.",
              });
            }
          })}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{form.formState.errors.token?.message}</FormMessage>
          <Button className="w-full" type="submit">
            Réinitialiser
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}