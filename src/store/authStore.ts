
import { create } from 'zustand';
import { UserRole } from '@/types/enums';

// Interface pour le profil utilisateur simplifié côté frontend
interface UserProfile {
	id: number;
	email: string;
	role: UserRole;
	firstName?: string | null;
	lastName?: string | null;
}

interface AuthState {
	user: UserProfile | null;
	isAuthenticated: boolean;
	isLoading: boolean; // Pour le check initial
	setUser: (user: UserProfile | null) => void;
	setLoading: (loading: boolean) => void;
	isAdmin: () => boolean; // Helper to check if user is admin
	canManageUsers: () => boolean; // Helper to check if user can manage users
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true, // Commence en chargement pour le check initial
	setUser: (user) => set({ user: user, isAuthenticated: !!user, isLoading: false }),
	setLoading: (loading) => set({ isLoading: loading }),
	isAdmin: () => get().user?.role === UserRole.ADMIN,
	canManageUsers: () => get().user?.role === UserRole.ADMIN, // Only admins can manage users
}));