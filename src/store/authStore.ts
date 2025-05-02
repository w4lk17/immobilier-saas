
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
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true, // Commence en chargement pour le check initial
	setUser: (user) => set({ user: user, isAuthenticated: !!user, isLoading: false }),
	setLoading: (loading) => set({ isLoading: loading }),
}));