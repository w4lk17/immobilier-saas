"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ForgotPasswordCredentials,
  ForgotPasswordSchema,
} from "../schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const form = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mot de passe oublié ?</h1>
        <p className="text-sm text-muted-foreground">
          Recevez un lien par e-mail pour le réinitialiser.
        </p>
      </div>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async ({ email }) => {
            try {
              await forgotPassword(email);
            } catch (e: any) {
              form.setError("email", {
                message:
                  e.response?.data?.message ||
                  "Impossible d'envoyer le lien.",
              });
            }
          })}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            Envoyer le lien
          </Button>
        </form>
      </Form>
      <Link
        href="/login"
        className="text-sm text-primary hover:underline"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
