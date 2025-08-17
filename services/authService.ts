export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  createdAt: string;
}

class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated = false;

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Mock login logic
    if (email && password) {
      const user: User = {
        id: '1',
        name: 'Sarah Johnson',
        email: email,
        role: 'teacher',
        createdAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.isAuthenticated = true;
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  async signup(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Mock signup logic
    if (name && email && password) {
      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'teacher',
        createdAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.isAuthenticated = true;
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid data provided' };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}

export const authService = new AuthService();