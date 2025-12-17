"use client"

import { useAuth } from "@/components/AuthContext";
import { useState, type FormEvent } from "react"

// interface LoginPageProps {
//   onLogin: (username: string) => void
// }

export default function LoginPage() {
    const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        console.log("Enviando login:", { email, password });
        const success = await login(email, password);

        if (!success) {
        setError('Email ou senha inválidos. Tente novamente.');
        }

        setIsSubmitting(false);
    };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] -top-48 -right-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[300px] h-[300px] -bottom-36 -left-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[200px] h-[200px] top-1/2 left-1/4 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-[420px] animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl p-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl text-white mb-6">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="currentColor" />
                <path d="M20 10L28 16V24L20 30L12 24V16L20 10Z" fill="white" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sistema de Agendamentos
            </h1>
            <p className="text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all bg-white placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 4V9M8 11V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <div className="text-center pt-2">
              <a
                href="#"
                className="text-sm font-medium text-[#667eea] hover:text-[#764ba2] hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </form>

          {/* Demo info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Demo: Use qualquer e-mail e senha com 6+ caracteres
            </p>
          </div>
        </div>
      </div>

      {/* Responsive - hide circles on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .absolute > div {
            display: none;
          }
          .p-12 {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}