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

			// Redirect to role-specific dashboard
			const redirectPath = getRoleRedirectPath(loggedInUser);
			router.push(redirectPath);
		} catch (error: any) {
			console.error('Login failed:', error);
			setUser(null);
			const errorMessage = error.response?.data?.message || "Échec de la connexion.";
			toast.error(errorMessage);
			throw error; // Re-throw for form handling
		} finally {
			setLoading(false);
		}
	}, [setUser, setLoading, router]);

	const register = useCallback(async (credentials: RegisterCredentials) => {
		setLoading(true);
		try {
			const registeredUser = await authService.register(credentials);
			setUser(registeredUser);
			toast.success('Inscription réussie !');

			// Redirect to role-specific dashboard
			const redirectPath = getRoleRedirectPath(registeredUser);
			router.push(redirectPath);
		} catch (error: any) {
			console.error('Registration failed:', error);
			setUser(null);
			const errorMessage = error.response?.data?.message || "Échec de l'inscription.";
			toast.error(errorMessage);
			throw error; // Re-throw for form handling
		} finally {
			setLoading(false);
		}
	}, [setUser, setLoading, router]);

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
		logout,
		restoreProfile,
	};
}
