import useAuthStore from '@/store/authStore';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

const api = axios.create({
	baseURL: API_URL,
	// Important pour envoyer les cookies (HttpOnly) lors des requêtes cross-origin
	// si votre frontend et backend sont sur des domaines/ports différents.
	// Assurez-vous que votre backend est configuré avec CORS et 'credentials: true'.
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

// Request interceptor: Optionally attach bearer token if stored client-side
api.interceptors.request.use(
	(config) => {
		// if store an access token in the store/localStorage, attach it:
		const maybeToken = (useAuthStore as any).getState?.().token;
		if (maybeToken && config && config.headers) {
			config.headers['Authorization'] = `Bearer ${maybeToken}`;
		}
		return config;
	},
);

// Track if we're already refreshing to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// Response interceptor with refresh token retry logic
api.interceptors.response.use(
	(response) => response, // Retourne la réponse si succès
	async (error) => {
		const originalRequest = error.config;
		if (!originalRequest) return Promise.reject(error);

		// Prevent infinite loops: skip refresh for auth endpoints
		const isAuthEndpoint = originalRequest.url?.includes('/auth/');

		if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
			// If already refreshing, add request to queue
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					if (originalRequest.headers) {
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
					}
					return api(originalRequest);
				}).catch((err) => Promise.reject(err));

			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Try refresh token endpoint (cookies based)
				const response = await api.post('/auth/refresh');
				const newToken = response.data?.accessToken;

				// Restore le profil
				const restore = (useAuthStore as any).getState?.().restoreProfile;
				if (restore) await restore();

				// Process queued requests
				processQueue(null, newToken);

				// Retry original request
				if (newToken && originalRequest.headers) {
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				}
				return api(originalRequest);
			} catch (refreshError: any) {
				processQueue(refreshError, null);

				// On ne log que les vraies erreurs serveur (500+)
				if (refreshError?.response?.status >= 500) {
					console.error('Refresh server error:', refreshError);
				}
				// Refresh token failed: clear store and redirect
				const logout = (useAuthStore as any).getState?.().logout;
				if (logout) await logout(); // Met isAuthenticated à false

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
		// Pass other errors through
		return Promise.reject(error);
	}
);

export default api;