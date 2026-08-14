
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import useAuthStore from "@/store/authStore"; // Ton store Zustand
import { UpdateProfileSchema, ChangePasswordSchema } from "../schemas/profileSchemas";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../services/profileApi";
import { CurrentUser, User } from "@/types";

// Query Keys
export const PROFILE_KEYS = {
  me: ["profile", "me"],
};

// Helper pour convertir User (avec ?) en CurrentUser (strict pour le store)
// Cela assure que les clés existent, même si elles sont null.
const mapUserToCurrent = (user: User): CurrentUser => ({
  ...user,
  ownerProfile: user.ownerProfile ?? null,
  managerProfile: user.managerProfile ?? null,
  tenantProfile: user.tenantProfile ?? null,
});

/**
 * Hook pour récupérer le profil connecté
 * NOTE: On l'utilise surtout si on ne veut pas dépendre uniquement du store Zustand (ex: page de détail précise)
 */
export const useMyProfile = () => {
  const { setUser } = useAuthStore.getState();

  return useQuery({
    queryKey: PROFILE_KEYS.me,
    queryFn: async () => {
      const user = await getMyProfile();
      // Met à jour le store global à chaque fetch réussi
      setUser(mapUserToCurrent(user));
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
};

/**
 * Hook pour mettre à jour son profil
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: z.infer<typeof UpdateProfileSchema>) => updateMyProfile(data),
    onSuccess: (updatedUser) => {
      toast.success("Profil mis à jour avec succès");

      // 1. Mettre à jour le cache React Query
      queryClient.setQueryData(PROFILE_KEYS.me, updatedUser);

      // 2. Mettre à jour le Store Zustand (CRUCIAL pour le header/sidebar)
      setUser(mapUserToCurrent(updatedUser));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

/**
 * Hook pour changer le mot de passe
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: z.infer<typeof ChangePasswordSchema>) => changeMyPassword(data),
    onSuccess: () => {
      toast.success("Mot de passe changé avec succès");
      // Optionnel : Forcer la déconnexion ou demander une reconnexion
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erreur lors du changement de mot de passe";
      toast.error(message);
    },
  });
};