import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { LoginCredentials, RegisterCredentials, VerifyPhoneCredentials } from '../schemas/authSchemas';
import authService from '../services/authApi';
import { getRoleRedirectPath } from '@/lib/authUtils';
import { isAccountDisabled, isPhoneNotVerified } from '../lib/authErrors';

let hasHydrated = false;

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout, restoreProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) return;
    hasHydrated = true; (async () => {
      try {
        setUser(await authService.getProfile());
      } catch (error: any) {
        if (isAccountDisabled(error)) {
          toast.error('Votre compte a été désactivé.');
        } else if (error.response?.status !== 401) {
          console.error('Auth hydration error:', error.message);
        }
        setUser(null);
      }
      finally {
        setLoading(false);
      }
    })();
  }, [setUser, setLoading]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);

      try {
        await authService.login(credentials); // pose les cookies, pas besoin du user retourné

        const loggedInUser = await authService.getProfile(); // confirme la session
        setUser(loggedInUser);

        toast.success('Connexion réussie !');
        router.push(getRoleRedirectPath(loggedInUser));
      } catch (error: any) {
        setUser(null);

        if (isAccountDisabled(error)) {
          toast.error('Votre compte a été désactivé. Contactez l\'administrateur.');
          throw error; // pas de redirect vers verify-phone,
        }

        const message = error.response?.data?.message || 'Échec de la connexion.';
        toast.error(typeof message === 'string' ? message : message?.message ?? 'Échec de la connexion.');

        if (isPhoneNotVerified(error)) {
          sessionStorage.setItem('pendingVerificationPhone', credentials.phone);
          router.push('/verify-phone');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    }, [router, setLoading, setUser]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true);
      try {
        await authService.register(credentials);
        sessionStorage.setItem('pendingVerificationPhone', credentials.phone);
        toast.success('Inscription réussie ! Vérifiez votre téléphone.');
        router.push('/verify-phone');
      } catch (error: any) {
        const message = error.response?.data?.message || "Échec de l'inscription.";
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [router, setLoading]
  );

  const verifyPhone = useCallback(async (credentials: VerifyPhoneCredentials) => {
    try {
      await authService.verifyPhone(credentials);
      const verifiedUser = await authService.getProfile();
      setUser(verifiedUser);
      sessionStorage.removeItem('pendingVerificationPhone');
      toast.success('Numéro vérifié. Connexion réussie !');
      router.push(getRoleRedirectPath(verifiedUser));

    } catch (error) {
      if (isAccountDisabled(error)) {
        setUser(null);
        toast.error('Votre compte a été désactivé. Contactez l\'administrateur.');
        router.push('/login');
      }
      throw error;
    }
  }, [router, setUser]);

  const resendOtp = useCallback(
    async (phone: string) => {
      const result = await authService.resendOtp(phone);
      toast.success(result.message);
    }, []
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const result = await authService.forgotPassword(email);
        toast.success(result.message);
      } finally {
        setLoading(false);
      }
    }, [setLoading]
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      await authService.resetPassword(token, password);
      toast.success('Mot de passe réinitialisé.');
      router.push('/login');
    }, [router]
  );

  const logout = useCallback(
    async () => {
      try {
        await storeLogout();
        toast.success('Déconnexion réussie.');
      } finally {
        router.push('/login');
      }
    }, [router, storeLogout]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyPhone,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    restoreProfile

  };
}
