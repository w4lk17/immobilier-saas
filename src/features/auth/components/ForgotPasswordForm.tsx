"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormMessage, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function ForgotPasswordForm() {

  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  async function onSubmit() {

  } 

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublie ?</h1>
        <p className="text-sm text-muted-foreground">
          Saisissez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground lg:text-left">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Retour a la connexion
        </Link>
      </p>
    </div>
  )
}