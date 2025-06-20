import { create } from 'zustand';
import type { UserResponse } from '@/types/api';
import { setAuthToken, getAuthToken } from '@/lib/api';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRiotAccount: boolean;
  
  // Actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string, user: UserResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasRiotAccount: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    hasRiotAccount: !!(user?.summonerName && user?.tier)
  }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (token, user) => {
    setAuthToken(token);
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false,
      hasRiotAccount: !!(user?.summonerName && user?.tier)
    });
  },

  logout: () => {
    setAuthToken(null);
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      hasRiotAccount: false
    });
  },

  checkAuth: () => {
    const token = getAuthToken();
    const isAuth = !!token;
    set({ isAuthenticated: isAuth });
    return isAuth;
  }
})); 