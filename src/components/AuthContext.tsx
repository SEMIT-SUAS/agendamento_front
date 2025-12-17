import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/types/agendamento';
// import { authAPI, usuariosAPI } from '@/lib/api';

export type UserProfile = 'ADMIN' | 'CADASTRO' | 'CONSULTA';

const BASE_URL = 'http://192.168.200.157:8080/';

interface AuthContextType {
    isAuthenticated: boolean;
  user: Usuario | null;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  token: string | null;
  login: (login: string, senha: string) => Promise<boolean>;
  logout: () => void;
  clearCache: () => void;
//   refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas em ms

//   useEffect(() => {
//     const storedToken = localStorage.getItem('adi_token');
//     const storedUser = localStorage.getItem('adi_user');
//     const storedExpiration = localStorage.getItem('adi_token_expiration');

//     // Verifica se existe token e se ainda não expirou
//     if (storedToken && storedUser && storedExpiration) {
//       const now = new Date().getTime();

//       if (now < Number(storedExpiration)) {
//         // Sessão ainda válida
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       } else {
//         console.warn('🔒 Sessão expirada — limpando dados e forçando login');
//         localStorage.removeItem('adi_token');
//         localStorage.removeItem('adi_user');
//         localStorage.removeItem('adi_token_expiration');
//       }
//     }

//     setIsLoading(false);
//   }, []);

  const login = async (login: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}gerenciador/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      console.log('Login response status:', response);

      const reposta = await fetch(`${BASE_URL}gerenciador/usuario-logado`);

      

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }else{
        console.log('Usuario não encontrado');
        return false
      }

      const expiration = new Date().getTime() + SESSION_DURATION_MS;

    //   setToken(response.token);
    //   setUser(response.user);

    //   localStorage.setItem('adi_token', response.token);
    //   localStorage.setItem('adi_user', JSON.stringify(response.user));
    //   localStorage.setItem('adi_token_expiration', expiration.toString());

      console.log(`✅ Sessão iniciada — expira em ${new Date(expiration).toLocaleTimeString()}`);
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logout realizado');
    setUser(null);
    setToken(null);
    // localStorage.removeItem('adi_token');
    // localStorage.removeItem('adi_user');
    // localStorage.removeItem('adi_token_expiration');
  };

  const clearCache = () => {
    console.log('🧹 Limpando cache e redirecionando para login');
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

//   const refreshUser = async () => {
//     if (!token) {
//       console.warn('Cannot refresh user: no token available');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       let updatedUser;

//       try {
//         updatedUser = await authAPI.me();
//         if (!updatedUser.cpf && user?.id) {
//           console.warn('CPF missing from /auth/me, falling back to usuariosAPI');
//           updatedUser = await usuariosAPI.getById(user.id);
//         }
//       } catch (meError) {
//         console.warn('authAPI.me failed, trying usuariosAPI:', meError);
//         if (user?.id) {
//           updatedUser = await usuariosAPI.getById(user.id);
//         } else {
//           throw new Error('No user ID available for fallback refresh');
//         }
//       }

//       if (updatedUser) {
//         setUser(updatedUser);
//         localStorage.setItem('adi_user', JSON.stringify(updatedUser));
//       }
//     } catch (error: any) {
//       console.error('Failed to refresh user:', error);
//       if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
//         logout();
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        clearCache,
        isAuthenticated,
        // refreshUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
