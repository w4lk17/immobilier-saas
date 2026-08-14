import { useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { LoginCredentials, RegisterCredentials } from '../schemas/authSchemas';
import authService from '../services/authApi';
import { getRoleRedirectPath } from '@/lib/authUtils';

// Global hydration flag to ensure hydration only runs once across all components
let hasHydrated = false;

export function useAuth() {
	const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout, restoreProfile } = useAuthStore();
	const router = useRouter();

	// Hydrate auth on mount - only once globally
	useEffect(() => {
		// Skip if already hydrated
		if (hasHydrated) return;
		hasHydrated = true;

		const hydrate = async () => {
			try {
				const profile = await authService.getProfile();
				setUser(profile);
			} catch (error: any) {
				// 401 is expected when user is not logged in - don't treat as error
				if (error.response?.status !== 401) {
					// Only log unexpected errors
					console.error('Auth hydration error:', error.message);
				}
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		hydrate();
	}, [setUser, setLoading]);

	const login = useCallback(async (credentials: LoginCredentials) => {
		setLoading(true);
		try {
			const loggedInUser = await authService.login(credentials);
			setUser(loggedInUser);
			toast.success('Connexion réussie !');
			const redirectPath = getRoleRedirectPath(loggedInUser);
			router.push(redirectPath);
		} catch (error: any) {
			console.error('Login failed:', error);
			setUser(null);
			const errorMessage = error.response?.data?.message || "Échec de la connexion.";
			toast.error("Échec de la connexion.");
		} finally {
			setLoading(false);
		}
	}, [setUser, setLoading, router]);

	const register = useCallback(async (credentials: RegisterCredentials) => {
		setLoading(true);
		try {
			await authService.register(credentials);
			toast.success('Inscription réussie ! Vérifiez vos emails pour activer votre compte.');
			router.push('/login?verificationSent=true');

		} catch (error: any) {
			console.error('Registration failed:', error);
			// setUser(null) pas nécessaire ici, on était pas connecté
			const errorMessage = error.response?.data?.message || "Échec de l'inscription.";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, router]); 

	const verifyEmail = useCallback(async (token: string) => {
		try {
			await authService.verifyEmail(token);
			toast.success('Email vérifié ! Vous pouvez vous connecter.');
		} catch (error: any) {
			console.error('Email verification failed:', error);
			const errorMessage = error.response?.data?.message || "Lien invalide ou expiré.";
			toast.error(errorMessage);
			throw error;
		}
	}, []);

	const forgotPassword = useCallback(async (email: string) => {
		setLoading(true);
		try {
			await authService.forgotPassword(email);
			toast.success("Un lien de réinitialisation a été envoyé à votre adresse email.");
		} catch (error: any) {
			console.error("Forgot password error:", error);
			const errorMessage = error.response?.data?.message || "Impossible d'envoyer l'email de réinitialisation.";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading]);

	// TODO: resetPassword useCallback

	const logout = useCallback(async () => {
		try {
			await storeLogout();
			toast.success('Déconnexion réussie.');
			router.push('/login');
		} catch (error: any) {
			console.error('Logout failed:', error);
			setUser(null);
			toast.error('Erreur lors de la déconnexion.');
			router.push('/login');
		}
	}, [storeLogout, setUser, router]);

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		verifyEmail,
		logout,
		restoreProfile,
	};
}
