import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, UsuarioLogin } from '@/types/agendamento';

// import { authAPI, usuariosAPI } from '@/lib/api';

export type UserProfile = 'ADMIN' | 'CADASTRO' | 'CONSULTA';

const BASE_URL = 'http://192.168.200.180:8080/';

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
   const [Usuarios, setUsuarios] = useState<UsuarioLogin | null>(null);

  const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas em ms

  useEffect(() => {
        const storedToken = localStorage.getItem('agendamento_token');
        const storedUser = localStorage.getItem('agendamento_user');
        const storedExpiration = localStorage.getItem('agendamento_token_expiration');

        if (storedToken && storedExpiration) {
            const now = Date.now();

            if (now < Number(storedExpiration)) {
            setToken(storedToken);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setIsAuthenticated(true);
            console.log('🔁 Sessão restaurada do localStorage');
            } else {
            console.warn('⏰ Sessão expirada');
            localStorage.clear();
            }
        }

        setIsLoading(false);
        }, []);

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
      setError(''); // Limpa erros anteriores

      const response = await fetch(`${BASE_URL}gerenciador/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        throw new Error('Login inválido');
      }

      const data = await response.json();
      console.log('Login sucesso:', data);

      // 1. Calcular expiração (24h)
      const expiration = new Date().getTime() + SESSION_DURATION_MS;

      // 2. Salvar Token e dados básicos
      setToken(data.token);
      localStorage.setItem('agendamento_token', data.token);
      localStorage.setItem('agendamento_token_expiration', expiration.toString());

      // 3. Buscar os dados completos do usuário usando o token recebido
      const userResponse = await fetch(`${BASE_URL}gerenciador/usuario-logado`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        localStorage.setItem('agendamento_user', JSON.stringify(userData));
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro no processo de login:', err);
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
