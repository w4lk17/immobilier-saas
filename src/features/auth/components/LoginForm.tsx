"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginCredentials, LoginSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import { PasswordInput } from '@/components/shared/password-input';
import 'react-phone-number-input/style.css';




export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { phone: '', password: '' }
  });

  async function onSubmit(values: LoginCredentials) {
    setError(null);
    try {
      await login(values);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Connectez-vous avec votre compte Hofeti.
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField control={form.control}
            name="phone"
            render={({ field }) =>
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  {/* Le conteneur ci-dessous gère l'unique bordure Shadcn globale */}
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <PhoneInput
                      defaultCountry="TG"
                      international
                      countryCallingCodeEditable={false}
                      value={field.value}
                      onChange={(value) => field.onChange(value || '')}
                      // Cette classe supprime les styles d'input par défaut du package
                      className="flex flex-1 items-center gap-2 custom-phone-input"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>}
          />

          <FormField control={form.control}
            name="password"
            render={({ field }) =>
              <FormItem className='mt-6'>
                <div className="flex items-center">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link href="/forgot-password" className="ml-auto text-xs text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>}
          />
          <Button type="submit"
            className="w-full mt-2"
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Form>
      <p className="text-sm text-muted-foreground text-center">
        Nouveau chez Hofeti?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
