"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Agendamento, UltimaChamada } from "../types/agendamento"

interface Call {
  id: string;
  senha: string;
  guiche: string;
  usuario: string;
  servico: string;
  descricaoServico: string;
  tipo: string;
  timestamp: Date;
  status: "chamando" | "em_atendimento" | "finalizado";
}

const SENHAS = ["A", "B", "C", "D"];
const GUICHES = ["01", "02", "03", "04", "05"]

const BASE_URL = "http://192.168.200.18:8080";

export default function CallBoardPage() {
    const [ultimaChamada, setUltimaChamada] = useState<UltimaChamada | null>(null)


     useEffect(() => {
        fetch(`${BASE_URL}/agendamentos/ultima-chamada`)
        .then(response => response.json())
        .then(data => {
            // 👇 extraindo só o que você quer
            const chamadaFiltrada = {
            senha: data.senha,
            tipoAtendimento: data.tipoAtendimento,
            usuarioNome: data.usuarioNome,
            agendamentoId: data.agendamentoId,
            horaChamada: data.horaChamada,
            usuarioId: data.usuarioId,
            servicoId: data.servicoId,
            servicoNome: data.servicoNome,
            guiche: data.guiche
            }

            setUltimaChamada(chamadaFiltrada)
        })
        .catch(error => {
            console.error("Erro:", error)
        })
    }, [])


    useEffect(() => {
    const buscarUltimaChamada = () => {
      fetch(`${BASE_URL}/agendamentos/ultima-chamada`)
        .then(res => res.json())
        .then(data => {
          setUltimaChamada(data)
        })
        .catch(err => console.error(err))
    }

    // 🔹 busca imediatamente ao entrar na página
    buscarUltimaChamada()

    // 🔁 atualiza a cada 3 segundos
    const interval = setInterval(() => {
      buscarUltimaChamada()
    }, 1000)

    // 🧹 limpeza obrigatória
    return () => clearInterval(interval)
  }, [])

  const [currentCall, setCurrentCall] = useState<Call>({
    id: "current",
    senha: "N005",
    guiche: "01",
    usuario: "Benilson",
    servico: "Cadastro Social",
    descricaoServico: "Cadastro social de familias em situação de vulnerabilidade",
    tipo: "NORMAL",
    timestamp: new Date("2025-12-11T16:37:01"),
    status: "chamando",
  });

  const [lastCalls, setLastCalls] = useState<Call[]>([
    {
      id: "1",
      senha: "A-042",
      guiche: "01",
      usuario: "João Silva",
      servico: "Atendimento",
      descricaoServico: "Atendimento geral",
      tipo: "NORMAL",
      timestamp: new Date(Date.now() - 2 * 60000),
      status: "em_atendimento",
    },
    {
      id: "2",
      senha: "C-038",
      guiche: "03",
      usuario: "Maria Santos",
      servico: "Documentação",
      descricaoServico: "Análise de documentação",
      tipo: "URGENTE",
      timestamp: new Date(Date.now() - 5 * 60000),
      status: "em_atendimento",
    },
    {
      id: "3",
      senha: "B-061",
      guiche: "02",
      usuario: "Carlos Oliveira",
      servico: "Protocolo",
      descricaoServico: "Abertura de protocolo",
      tipo: "NORMAL",
      timestamp: new Date(Date.now() - 8 * 60000),
      status: "finalizado",
    },
    {
      id: "4",
      senha: "A-039",
      guiche: "04",
      usuario: "Ana Costa",
      servico: "Financeiro",
      descricaoServico: "Consulta financeira",
      tipo: "NORMAL",
      timestamp: new Date(Date.now() - 12 * 60000),
      status: "finalizado",
    },
    {
      id: "5",
      senha: "D-027",
      guiche: "05",
      usuario: "Pedro Ferreira",
      servico: "Consulta",
      descricaoServico: "Consulta geral",
      tipo: "NORMAL",
      timestamp: new Date(Date.now() - 15 * 60000),
      status: "finalizado",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const letraSenha = SENHAS[Math.floor(Math.random() * SENHAS.length)];
      const numeroSenha = String(Math.floor(Math.random() * 100) + 1).padStart(3, "0");
      setCurrentCall(prev => ({
        ...prev,
        senha: `${letraSenha}-${numeroSenha}`,
        timestamp: new Date(),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return "Agora";
    if (diff === 1) return "1 min";
    return `${diff} min`;
  };

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_atendimento":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "finalizado":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "em_atendimento":
        return <Clock className="w-3 h-3" />;
      case "finalizado":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Panel - Last Calls */}
      <div className="w-96 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-700">
          <h2 className="text-white font-bold text-xl">ÚLTIMAS CHAMADAS</h2>
          <p className="text-slate-400 text-xs mt-1">5 últimos atendimentos</p>
        </div>

        {/* Calls List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {lastCalls.map((call, index) => (
            <div
              key={call.id}
              className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/60 transition-all duration-300"
            >
              {/* Top row - Number and Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {index + 1}
                </span>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(call.status)}`}>
                  {getStatusIcon(call.status)}
                  {call.status === "em_atendimento" ? "ATENDENDO" : "FINALIZADO"}
                </span>
              </div>

              {/* Senha */}
              <p className="text-white font-black text-lg mb-2 tracking-wide">{call.senha}</p>

              {/* Details */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Guichê:</span>
                  <span className="text-white font-semibold">{call.guiche}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="text-white font-semibold truncate ml-2">{call.usuario}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Serviço:</span>
                  <span className="text-white font-semibold truncate ml-2">{call.servico}</span>
                </div>
              </div>

              {/* Time */}
              <p className="text-slate-500 text-xs mt-3 text-right">{formatTime(call.timestamp)}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50 text-center">
          <p className="text-slate-500 text-xs">Informações em tempo real</p>
        </div>
      </div>

      {/* Main Display - Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-16">
            <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Próxima Chamada</p>
            <p className="text-slate-300 text-lg font-light">Dirija-se ao guichê informado</p>
          </div>

          {/* Large Senha Display */}
          <div className="relative mb-12">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />

            {/* Main card */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-16 shadow-2xl border border-slate-700">
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-black text-cyan-400 tracking-wider drop-shadow-lg mb-8">
                  {ultimaChamada?.senha}
                </div>
                {/* Guichê */}
<div className="flex justify-center">
  <div className="flex items-center gap-4 px-10 py-5 rounded-lg bg-slate-900 border border-slate-600">
    <span className="text-lg md:text-xl font-semibold uppercase tracking-wider text-slate-300">
      Guichê
    </span>
    <span className="text-5xl font-bold text-white">
      {ultimaChamada?.guiche}
    </span>
  </div>
</div>
              </div>
            </div>
          </div>

          {/* Call Details Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-slate-700 shadow-xl">
            {/* Name */}
            <div className="text-center mb-8">
              <p className="text-white text-4xl font-bold tracking-wide">{ultimaChamada?.usuarioNome}</p>
            </div>

            {/* Service Section */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <p className="text-slate-300 text-sm mb-2">
                <span className="text-slate-400">Serviço:</span> {ultimaChamada?.servicoNome}
              </p>
            </div>

            {/* Type */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Tipo:</span>
                <span className={`px-4 py-2 rounded font-semibold text-sm ${
                  ultimaChamada?.tipoAtendimento === "PRIORIDADE"
                    ? "bg-red-600/20 text-red-300 border border-red-600/50"
                    : "bg-blue-600/20 text-blue-300 border border-blue-600/50"
                }`}>
                  {ultimaChamada?.tipoAtendimento}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center">
              <p className="text-slate-400 text-xs">Chamado em:</p>
              {ultimaChamada?.horaChamada && (
                <p className="text-white text-lg font-semibold mt-1">
                    {formatDateTime(new Date(ultimaChamada.horaChamada))}
                </p>
                )}
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-12">
            <p className="text-slate-400 text-sm">Atualizado em tempo real</p>
          </div>
        </div>
      </div>
    </div>
  );
}
