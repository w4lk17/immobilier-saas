
import api from '@/lib/api';
import { RegisterCredentials } from '@/features/auth/schemas/authSchemas'; 
import { UserFormData } from '../schemas/userSchemas'; // Schéma pour la mise à jour par Admin (à créer)
import { FrontendUserSnippet } from '@/types'; // Utiliser le snippet non sensible

// Type retourné par POST /users (inscription) - correspond à FrontendUserSnippet
type RegisterApiResponse = FrontendUserSnippet;

// Type retourné par GET /users/:id ou PATCH /users/:id - correspond à FrontendUserSnippet
type UserApiResponse = FrontendUserSnippet;


const usersService = {
	// Inscription publique (anciennement dans authApi)
	async register(credentials: RegisterCredentials): Promise<RegisterApiResponse> {
		const response = await api.post<RegisterApiResponse>('/users', credentials);
		return response.data;
	},

	// --- Opérations CRUD pour Admin ---

	async getUsers(): Promise<UserApiResponse[]> {
		const response = await api.get<UserApiResponse[]>('/users');
		return response.data;
	},

	async getUserById(id: number): Promise<UserApiResponse> {
		const response = await api.get<UserApiResponse>(`/users/${id}`);
		return response.data;
	},

	async updateUser(id: number, data: Partial<UserFormData>): Promise<UserApiResponse> {
		// Attention: Le backend gère le hashage si 'password' est dans data
		const response = await api.patch<UserApiResponse>(`/users/${id}`, data);
		return response.data;
	},

	async deleteUser(id: number): Promise<UserApiResponse> {
		const response = await api.delete<UserApiResponse>(`/users/${id}`);
		return response.data; // Retourne l'utilisateur supprimé
	}
	// Pas de createUser ici car géré par register (public) ou une route admin spécifique si besoin
};

export default usersService;