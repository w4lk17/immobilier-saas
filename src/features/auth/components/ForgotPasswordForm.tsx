"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormMessage, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function ForgotPasswordForm() {

  const form = useForm<{ email: string }>({ });

  async function onSubmit() {} //TODO:

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden shadow-lg ">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              className="flex flex-col gap-8 p-6 md:p-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold tracking-tight">Mot de passe oublié&nbsp;?</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit" className="w-full"
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
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="hover:underline underline-offset-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  Retour à la connexion
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}