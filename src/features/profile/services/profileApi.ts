
import api from '@/lib/api';
import type { User } from '@/types';
import type { UpdateProfileFormData, ChangePasswordFormData } from '../schemas/profileSchemas';

/**
 * Récupère le profil de l'utilisateur connecté
 * GET /users/me
 */
export const getMyProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

/**
 * Met à jour les informations du profil connecté
 * PATCH /users/me
 */
export const updateMyProfile = async (data: UpdateProfileFormData): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

/**
 * Change le mot de passe du compte connecté
 * POST /users/me/change-password
 */
export const changeMyPassword = async (data: ChangePasswordFormData): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/users/me/change-password', data);
  return response.data;
};

export default {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};