import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated } from '../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      if (isAuthenticated()) {
        try {
          // Carregar dados do usuário
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Em caso de erro, fazer logout
          apiLogout();
        }
      }
      
      setLoading(false);
    }

    loadStoredData();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      // Fazer login e obter token
      await apiLogin({ username, password });
      
      // Carregar dados do usuário
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

