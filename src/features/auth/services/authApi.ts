import api from '@/lib/api';
import {
  LoginCredentials,
  RegisterCredentials,
  VerifyPhoneCredentials
} from '../schemas/authSchemas';
import { CurrentUser } from '@/types';

const authService = {
  async login(credentials: LoginCredentials): Promise<CurrentUser> {
    await api.post('/auth/login', credentials);
    return this.getProfile();
  },

  async register(credentials: RegisterCredentials): Promise<{ message: string }> {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  async verifyPhone(credentials: VerifyPhoneCredentials): Promise<CurrentUser> {
    await api.post('/auth/verify-phone', credentials);
    return this.getProfile();
  },

  async resendOtp(phone: string): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-otp', { phone });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<CurrentUser> {
    const response = await api.get<CurrentUser>('/users/me');
    return response.data;
  }
};

export default authService;
