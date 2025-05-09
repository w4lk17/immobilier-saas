
import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	// Important pour envoyer les cookies (HttpOnly) lors des requêtes cross-origin
	// si votre frontend et backend sont sur des domaines/ports différents.
	// Assurez-vous que votre backend est configuré avec CORS et 'credentials: true'.
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

// Optionnel : Intercepteurs pour gérer les erreurs globales, etc.
api.interceptors.response.use(
	(response) => response, // Retourne la réponse si succès
	(error) => {
		// Gérer les erreurs globales ici (ex: erreur 401 non autorisée, etc.)
		if (error.response?.status === 401 && error.response?.data?.message === 'No auth token') {
			console.info('Error: No auth token');	
		} else if (error.response?.status === 401 && error.response?.data?.message === 'jwt expired') {
			// Gérer le cas ou le token est expire
			// Vous pouvez rediriger vers la page de login
			// ou autre action appropriée si besoin (voir useAuth) 
			console.info('Info: Token expired');
		}
		// Vous pourriez vouloir déclencher un logout global ici si 401
		// console.log('API Error:', error.response?.data || error.message);
		// Rejeter l'erreur pour que les appels spécifiques puissent la gérer aussi
		return Promise.reject(error);
	}
);

export default api;