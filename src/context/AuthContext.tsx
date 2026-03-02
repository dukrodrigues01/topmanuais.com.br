import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addToFavorites: (manualId: string) => void;
  removeFromFavorites: (manualId: string) => void;
  isFavorite: (manualId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário de demonstração
const DEMO_USER: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  role: 'customer',
  purchases: [],
  favorites: [],
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'joao@exemplo.com' && password === '123456') {
      setUser(DEMO_USER);
      toast.success('Login realizado com sucesso!');
      return true;
    }
    
    // Login simulado para qualquer email válido
    if (email.includes('@') && password.length >= 6) {
      const newUser: User = {
        ...DEMO_USER,
        email,
        name: email.split('@')[0],
      };
      setUser(newUser);
      toast.success('Login realizado com sucesso!');
      return true;
    }
    
    toast.error('Email ou senha incorretos');
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulação de registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email.includes('@') && password.length >= 6 && name.length >= 3) {
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: 'customer',
        purchases: [],
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      toast.success('Conta criada com sucesso!');
      return true;
    }
    
    toast.error('Dados inválidos. Verifique as informações.');
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info('Logout realizado');
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    toast.success('Perfil atualizado!');
  }, []);

  const addToFavorites = useCallback((manualId: string) => {
    setUser(prev => {
      if (!prev) return null;
      if (prev.favorites.includes(manualId)) return prev;
      
      toast.success('Adicionado aos favoritos!');
      return {
        ...prev,
        favorites: [...prev.favorites, manualId],
      };
    });
  }, []);

  const removeFromFavorites = useCallback((manualId: string) => {
    setUser(prev => {
      if (!prev) return null;
      
      toast.info('Removido dos favoritos');
      return {
        ...prev,
        favorites: prev.favorites.filter(id => id !== manualId),
      };
    });
  }, []);

  const isFavorite = useCallback((manualId: string) => {
    return user?.favorites.includes(manualId) || false;
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }), [user, login, register, logout, updateProfile, addToFavorites, removeFromFavorites, isFavorite]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
