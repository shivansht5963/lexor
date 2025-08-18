import { httpJson, setAuthToken } from '@/services/apiClient';

export interface UserProfile {
  id: number;
  username: string;
  gmail: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
  created_at: string;
  full_name: string;
}

class AuthService {
  private currentUser: UserProfile | null = null;
  private isAuthenticated = false;

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // Backend expects username and password; if an email is provided, pass it as username
      const payload = { username: usernameOrEmail, password } as const;
      const response = await httpJson<{ message: string; user: UserProfile; token: string }>(
        '/auth/login/',
        { method: 'POST', body: payload }
      );
      setAuthToken(response.token);
      this.currentUser = response.user;
      this.isAuthenticated = true;
      return { success: true, user: response.user };
    } catch (err: any) {
      const details = err?.details;
      const error = typeof details === 'string' ? details : details?.non_field_errors?.[0] || 'Login failed';
      return { success: false, error };
    }
  }

  async signup(params: {
    username: string;
    gmail: string; // email field in backend
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    is_teacher?: boolean;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }>
  {
    try {
      const response = await httpJson<{ message: string; user: UserProfile; token: string }>(
        '/auth/register/',
        { method: 'POST', body: { is_teacher: true, ...params } }
      );
      setAuthToken(response.token);
      this.currentUser = response.user;
      this.isAuthenticated = true;
      return { success: true, user: response.user };
    } catch (err: any) {
      const details = err?.details;
      const values = details && typeof details === 'object' ? Object.values(details) as any[] : [];
      const first = Array.isArray(values[0]) ? values[0][0] : values[0];
      const error = typeof first === 'string' ? first : 'Signup failed';
      return { success: false, error };
    }
  }

  async logout(): Promise<void> {
    try {
      await httpJson<{ message: string }>(
        '/auth/logout/',
        { method: 'POST' }
      );
    } catch {}
    setAuthToken(null);
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  async fetchProfile(): Promise<UserProfile | null> {
    try {
      const profile = await httpJson<UserProfile>('/auth/profile/');
      this.currentUser = profile;
      this.isAuthenticated = true;
      return profile;
    } catch {
      return null;
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}

export const authService = new AuthService();