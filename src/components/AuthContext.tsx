import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Usuario } from "@/types/agendamento";

export type UserProfile = "ADMIN" | "CADASTRO" | "CONSULTA";

const BASE_URL = "http://192.168.100.21:8080/";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  token: string | null;
  login: (login: string, senha: string) => Promise<Usuario | null>;
  logout: () => void;
  clearCache: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

  useEffect(() => {
    const storedToken = localStorage.getItem("agendamento_token");
    const storedUser = localStorage.getItem("agendamento_user");
    const storedExpiration = localStorage.getItem("agendamento_token_expiration");

    if (storedToken && storedExpiration) {
      const now = Date.now();

      if (now < Number(storedExpiration)) {
        setToken(storedToken);

        if (storedUser) setUser(JSON.parse(storedUser));

        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("agendamento_token");
        localStorage.removeItem("agendamento_user");
        localStorage.removeItem("agendamento_token_expiration");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (login: string, senha: string): Promise<Usuario | null> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${BASE_URL}gerenciador/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const expiration = Date.now() + SESSION_DURATION_MS;

      setToken(data.token);
      localStorage.setItem("agendamento_token", data.token);
      localStorage.setItem("agendamento_token_expiration", expiration.toString());

      const userResponse = await fetch(`${BASE_URL}gerenciador/usuario-logado`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!userResponse.ok) return null;

      const userData: Usuario = await userResponse.json();
      setUser(userData);
      localStorage.setItem("agendamento_user", JSON.stringify(userData));

      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error("Erro no processo de login:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("agendamento_token");
    localStorage.removeItem("agendamento_user");
    localStorage.removeItem("agendamento_token_expiration");
  };

  const clearCache = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
