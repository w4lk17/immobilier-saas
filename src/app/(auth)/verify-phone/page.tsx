"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function VerifyPhonePage() {
  const router = useRouter();
  const { verifyPhone, resendOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [seconds, setSeconds] = useState(0);

  const form = useForm<{ code: string }>({
    defaultValues: { code: "" },
  });

  const maskedPhone = useMemo(() => {
    if (!phone) return "";
    return `${phone.slice(0, 5)} •••• ${phone.slice(-3)}`;
  }, [phone]);

  useEffect(() => {
    const pendingPhone = sessionStorage.getItem("pendingVerificationPhone");
    if (!pendingPhone) {
      router.replace("/login");
      return;
    }
    setPhone(pendingPhone);
  }, [router]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  if (!phone) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Vérifiez votre téléphone</h1>
        <p className="text-sm text-muted-foreground">
          Un code à 6 chiffres a été envoyé au {maskedPhone}.
        </p>
      </div>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async ({ code }) => {
            if (!/^\d{6}$/.test(code)) {
              form.setError("code", {
                message: "Le code doit comporter 6 chiffres.",
              });
              return;
            }
            try {
              await verifyPhone({ phone, code });
            } catch (error: any) {
              form.setError("code", {
                message:
                  error.response?.data?.message ||
                  "Code invalide ou expiré.",
              });
            }
          })}
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code OTP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Vérifier et continuer
          </Button>
        </form>
      </Form>
      <Button
        variant="outline"
        className="w-full"
        disabled={seconds > 0}
        onClick={async () => {
          try {
            await resendOtp(phone);
            setSeconds(60);
          } catch (error: any) {
            form.setError("code", {
              message:
                error.response?.data?.message ||
                "Impossible de renvoyer le code.",
            });
          }
        }}
      >
        {seconds > 0
          ? `Renvoyer dans ${seconds}s`
          : "Renvoyer le code"}
      </Button>
      <Link
        href="/login"
        className="block text-center text-sm text-primary hover:underline"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
