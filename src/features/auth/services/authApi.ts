
import api from '@/lib/api';
import { LoginCredentials, RegisterCredentials } from '../schemas/authSchemas';
import { UserRole } from '@/types/enums';
import { AuthUser } from '@/types';

// Interface décrivant la réponse EXACTE de l'API /auth/profile
interface ProfileApiResponse {
	userId: number; // L'API retourne 'userId'
	email: string;
	role: UserRole;
	firstName?: string | null;
	lastName?: string | null;
	// Assurez-vous que ces champs correspondent à ce que l'API renvoie réellement
}

const authService = {
	// Login : L'API login ne retourne rien dans le body si succès (tokens dans cookies)
	// Mais pour mettre à jour l'état, on appelle getProfile juste après
	async login(credentials: LoginCredentials): Promise<AuthUser> {
		await api.post('/auth/login', credentials);
		// Après un login réussi, les cookies sont positionnés par le backend.
		// On appelle getProfile pour récupérer les infos utilisateur à mettre dans le store.
		return this.getProfile();
	},

	// // Register: retourne l'utilisateur créé
	// async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
	// 	const response = await api.post('/users', credentials); // Appelle l'endpoint de création User
	// 	// Après une inscription réussie, on peut potentiellement connecter l'utilisateur
	// 	// Ici, on retourne les données de l'utilisateur créé
	// 	return response.data;
	// },


	// Logout : Invalide le refresh token côté serveur
	async logout(): Promise<void> {
		await api.post('/auth/logout');
		// Nettoyage des cookies par le backend et le hook useAuth met à jour le store
	},

	// Get Profile : Récupère les infos de l'utilisateur connecté (si token valide)
	// retourne le type AuthUser attendu par le store
	async getProfile(): Promise<AuthUser> {
		const response = await api.get<ProfileApiResponse>('/auth/profile');
		const apiData = response.data;
		// Mapper la réponse de l'API vers le type interne AuthUser
		return {
			id: apiData.userId,
			email: apiData.email,
			role: apiData.role,
			firstName: apiData.firstName,
			lastName: apiData.lastName,
			// Les champs createdAt/updatedAt ne sont généralement pas dans le JWT payload,
			// donc pas retournés par /auth/profile, sauf si vous modifiez le backend.
			// Laissez-les undefined ou ajoutez-les si votre API les renvoie.
			createdAt: new Date(), // Placeholder si nécessaire, mais idéalement l'API devrait retourner les vraies valeurs si utiles
			updatedAt: new Date(), // Placeholder
		};
	},

	// Refresh Token : Géré via les cookies HttpOnly et l'intercepteur d'Axios 
	// Souvent, si une requête échoue avec 401, on essaie /auth/refresh puis on réessaie la requête initiale.
	// Axios interceptors sont un bon endroit pour ça.
};

export default authService;