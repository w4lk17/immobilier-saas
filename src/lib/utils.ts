import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatage des nombres (exemple simple)
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value);
};


/**
 * Formate un numéro de téléphone selon le code pays fourni.
 * @param phone Numéro brut (peut contenir ou non le code pays, espaces ou non)
 * @param countryCode Code pays alpha-2 (ex: "TG" pour Togo, "BJ" pour Bénin, "FR" pour France)
 * @returns Numéro formaté en international, ou '-' si invalide.
 */
export function formatPhone(phone: string, countryCode: string = "TG"): string {
  if (!phone) return "-";
  try {
    const parsed = parsePhoneNumberFromString(phone, countryCode as CountryCode);
    if (!parsed) return "-";
    return parsed.formatInternational(); // e.g. "+228 XX XX XX XX"
  } catch {
    return "-";
  }
}
