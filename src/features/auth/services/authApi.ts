
import api from '@/lib/api';
import { LoginCredentials, RegisterCredentials } from '../schemas/authSchemas';
import { CurrentUser } from '@/types';


const authService = {
	// Login : L'API login ne retourne rien dans le body si succès (tokens dans cookies)
	async login(credentials: LoginCredentials): Promise<CurrentUser> {
		await api.post('/auth/login', credentials);
		// Une fois connecté, on récupère le profil complet
		return this.getProfile();
	},

	async register(credentials: RegisterCredentials): Promise<CurrentUser> {
		await api.post('/auth/register', credentials);
		return this.getProfile();
	},

	// Logout : Invalide le refresh token côté serveur
	async logout(): Promise<void> {
		await api.post('/auth/logout');
	},

	// Get Profile : Récupère les infos de l'utilisateur connecté (si token valide)
	// retourne le type CurrentUser attendu par le store
	async getProfile(): Promise<CurrentUser> {
		const response = await api.get<CurrentUser>('/users/me');
		return response.data;
	},
};

export default authService;