
import { create } from 'zustand';
import { CurrentUser } from '@/types';
import authService from '@/features/auth/services/authApi';
import { getRoleRedirectPath, getRoleName } from '@/lib/authUtils';

interface AuthState {
	user: CurrentUser | null;
	isAuthenticated: boolean;
	isLoading: boolean; // Pour le check initial
	setUser: (user: CurrentUser | null) => void;
	setLoading: (loading: boolean) => void;
	isAdmin: () => boolean; // Helper to check if user is admin
	canManageUsers: () => boolean; // Helper to check if user can manage users
	getDashboardPath: () => string; // Get the dashboard path for current user
	getRoleName: () => string; // Get user-friendly role name
	logout: () => Promise<void>; // Logout method
	restoreProfile: () => Promise<void>; // Restore profile from API
}

const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true, // Commence en chargement pour le check initial

	setUser: (user) => set({ user: user, isAuthenticated: !!user, isLoading: false }),
	setLoading: (loading) => set({ isLoading: loading }),

	isAdmin: () => get().user?.role === 'ADMIN',
	canManageUsers: () => get().user?.role === 'ADMIN', // Only admins can manage users

	getDashboardPath: () => getRoleRedirectPath(get().user),
	getRoleName: () => getRoleName(get().user?.role || ''),

	logout: async () => {
		try {
			await authService.logout();
		} catch (error) {
			// Ignorer l'erreur 401 ici, c'est normal si le token est déjà mort
			console.warn('Logout API call failed (ignored)', error);
		}
		set({ user: null, isAuthenticated: false, isLoading: false });
	},
	restoreProfile: async () => {
		// Si on est déjà en train de charger, on ne fait rien
		if (get().isLoading && get().user !== null) return;

		set({ isLoading: true });
		try {
			const profile = await authService.getProfile();
			set({ user: profile, isAuthenticated: true, isLoading: false });
		} catch (error) {
			// L'erreur est gérée par l'intercepteur, on met juste le state à jour
			set({ user: null, isAuthenticated: false, isLoading: false });
		}
	},
}));

export default useAuthStore;