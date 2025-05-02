
import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore'; // Importez le store
import { LoginCredentials, RegisterCredentials } from '../schemas/authSchemas'; // Importez les types Zod (à créer)
import { useRouter } from 'next/navigation';
import authService from '../services/authApi'; // Importez les fonctions API (à créer)
import toast from 'react-hot-toast';

export function useAuth() {
	const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();
	const router = useRouter();

	const login = useCallback(async (credentials: LoginCredentials) => {
		setLoading(true);
		try {
			const loggedInUser = await authService.login(credentials); // L'API login retourne le profil user si succès
			setUser(loggedInUser); // Mettre à jour le store
			toast.success('Connexion réussie !');
			router.push('/'); // Rediriger vers le dashboard ou autre page
		} catch (error: any) {
			console.error('Login failed:', error);
			setUser(null); // Assurer que l'utilisateur est null en cas d'échec
			toast.error(error.response?.data?.message || 'Échec de la connexion.');
		} finally {
			setLoading(false);
		}
	}, [setUser, setLoading, router]);

	// const register = useCallback(async (credentials: RegisterCredentials) => {
	// 	setLoading(true);
	// 	try {
	// 		const registeredUser = await authService.register(credentials);
	// 		setUser(registeredUser); // Connecte l'utilisateur après l'inscription
	// 		toast.success('Inscription réussie !');
	// 		router.push('/');
	// 	} catch (error: any) {
	// 		console.error('Registration failed:', error);
	// 		setUser(null);
	// 		toast.error(error.response?.data?.message || "Échec de l'inscription.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }, [setUser, setLoading, router]);


	const logout = useCallback(async () => {
		// setLoading(true); // Pas forcément utile pour logout
		try {
			await authService.logout(); // Appeler l'API logout (qui clear les cookies côté serveur/client)
			setUser(null); // Mettre à jour le store
			toast.success('Déconnexion réussie.');
			router.push('/login'); 
		} catch (error: any) {
			console.error('Logout failed:', error);
			// Même si l'API échoue, on déconnecte côté client
			setUser(null);
			toast.error('Erreur lors de la déconnexion.');
			router.push('/login'); 
		} finally {
			// setLoading(false);
		}
	}, [setUser, router]);

	const checkAuthStatus = useCallback(async () => {
		console.log('Checking auth status...');
		// Ne pas re-vérifier si on n'est pas en chargement initial ou si déjà authentifié ?
		// if (!isLoading && isAuthenticated) return;

		setLoading(true);
		try {
			// Appeler l'endpoint 'profile' qui est protégé par JWT
			// Si succès, l'utilisateur est authentifié (cookie valide)
			const currentUser = await authService.getProfile();
			console.log('Auth status check successful:', currentUser);
			setUser(currentUser);
		} catch (error) {
			// Si l'appel échoue (401), l'utilisateur n'est pas authentifié
			console.log('Auth status check failed:', error);
			setUser(null);
		} finally {
			// Important : Mettre fin au chargement même en cas d'erreur
			setLoading(false);
		}
	}, [setUser, setLoading/* , isAuthenticated, isLoading */]); // Ajoutez deps si la condition if est utilisée

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		// register,
		logout,
		checkAuthStatus,
	};
}