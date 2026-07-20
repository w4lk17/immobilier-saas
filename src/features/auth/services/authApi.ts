
import api from '@/lib/api';
import { LoginCredentials, RegisterCredentials } from '../schemas/authSchemas';
import { CurrentUser } from '@/types';


const authService = {
	// Login : L'API login set les cookies, puis on récupère le profil
	async login(credentials: LoginCredentials): Promise<CurrentUser> {
		await api.post('/auth/login', credentials);
		return this.getProfile();
	},

	async register(credentials: RegisterCredentials): Promise<{ message: string }> {
		const response = await api.post('/auth/register', credentials);
		return response.data.message;
	},

	async verifyEmail(token: string): Promise<void> {
		await api.get(`/auth/verify-email?token=${token}`);
	},

	async forgotPassword(email: string): Promise<{ message: string }> {
		const response = await api.post('/auth/forgotPassword', email);
		return response.data.message;
	},

	//TODO: resetPassword service

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