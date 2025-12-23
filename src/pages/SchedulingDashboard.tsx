"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ActionButtons from "../components/ActionButtons";
import SchedulingTable from "../components/SchedulingTable";
import SchedulingModal from "../components/SchedulingModal";
import DetailsModal from "../components/DetailsModal";
import type { Agendamento } from "../types/agendamento";
import { useAuth } from "@/components/AuthContext";
import { LogOut, Calendar, Clock, Users } from "lucide-react";

interface SchedulingDashboardProps {
  onNavigate: () => void;
  onLogout: () => void;
  currentUser: string;
}

const BASE_URL = "http://192.168.200.157:8080/agendamentos";

export default function SchedulingDashboard({
  onNavigate,
}: SchedulingDashboardProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout, clearCache } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedByUser, setSelectedByUser] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/secretaria/30`);
        console.log("Retorno de SecretariaID:", response);
        const data = await response.json();
        const lista = Array.isArray(data)
          ? data
          : data.content || data.data || [];
        setAgendamentos(lista);
        // Auto-select em atendimento
        const emAtendimento = lista.find(
          (e: Agendamento) => e.situacao === "EM_ATENDIMENTO"
        );
        if (emAtendimento) {
          setSelectedAgendamento(emAtendimento);
          setSelectedByUser(false);
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // const interval = setInterval(loadData, 10000)
    // return () => clearInterval(interval)
  }, []);

  const handleRowClick = (agendamento: Agendamento) => {
    // Esta função será chamada apenas para seleção de linha,
    // o botão já lidou com sua própria lógica e stopPropagation
    setSelectedAgendamento(agendamento);
  };

  const handleCall = async (tipo: "normal" | "prioridade") => {
    try {
      const response = await fetch(`${BASE_URL}/chamar/${tipo}`, {
        method: "POST",
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
      if (response.ok) {
        if (data?.agendamento) {
          setSelectedAgendamento(data.agendamento);
        }
        // Reload the list
        const listResponse = await fetch(`${BASE_URL}/listar-todos`);
        const listData = await listResponse.json();
        const lista = Array.isArray(listData)
          ? listData
          : listData.content || [];
        setAgendamentos(lista);
      }
    } catch (error) {
      console.error("Erro ao chamar:", error);
      alert("Erro ao chamar agendamento");
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAgendamento?.agendamentoId) return;
    if (!confirm(`Cancelar a senha ${selectedAgendamento.senha}?`)) return;
    try {
      const response = await fetch(
        `${BASE_URL}/cancelar/${selectedAgendamento.agendamentoId}`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        alert("Agendamento cancelado com sucesso!");
        setSelectedAgendamento(null);
        // Reload
        const listResponse = await fetch(`${BASE_URL}/listar-todos`);
        const listData = await listResponse.json();
        const lista = Array.isArray(listData)
          ? listData
          : listData.content || [];
        setAgendamentos(lista);
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao cancelar agendamento");
    }
  };

  const handleShowDetails = async () => {
    if (!selectedAgendamento?.agendamentoId) return;
    try {
      const response = await fetch(`${BASE_URL}/detalhes`);
      const dados = await response.json();
      const detalhe = dados.find(
        (a: Agendamento) =>
          Number(a.agendamentoId) ===
          Number(selectedAgendamento.agendamentoId)
      );
      if (detalhe) {
        setSelectedAgendamento(detalhe);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      alert("Erro ao buscar detalhes");
    }
  };

  const termo = searchTerm.trim().toLowerCase();
  const filteredAgendamentos =
    termo === ""
      ? agendamentos
      : agendamentos.filter(
          (agendamento) =>
            agendamento.usuarioNome?.toLowerCase().includes(termo) ||
            agendamento.senha?.toLowerCase().includes(termo) ||
            agendamento.servicoNome?.toLowerCase().includes(termo)
        );

  const handleOpenDetails = (agendamento: Agendamento) => {
    setSelectedByUser(true); 
    setSelectedAgendamento(agendamento);
    setShowDetailsModal(true);
  };

  const totalPages = Math.ceil(filteredAgendamentos.length / ITEMS_PER_PAGE);

  const paginatedAgendamentos = filteredAgendamentos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
  const pages: number[] = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

  const totalAgendamentos = agendamentos.length;
  const emAtendimento = agendamentos.filter(
    (a) => a.situacao === "EM_ATENDIMENTO"
  ).length;
  const finalizados = agendamentos.filter(
    (a) => a.situacao === "FINALIZADO"
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-2xl border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                  Painel de Agendamentos
                </h1>
                <p className="text-sm text-indigo-200 mt-1 font-medium">
                  Centro Avançado de Apoio - São Luís
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={clearCache}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 text-sm font-semibold border border-red-400/30 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Card */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                    Total de Agendamentos
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    {totalAgendamentos}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 p-4 rounded-2xl group-hover:from-blue-400/30 group-hover:to-blue-600/30 transition-all duration-300 shadow-lg">
                  <Calendar className="w-8 h-8 text-blue-300" />
                </div>
              </div>
            </div>

            {/* Em Atendimento Card */}
            <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-2">
                    Em Atendimento
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    {emAtendimento}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 p-4 rounded-2xl group-hover:from-emerald-400/30 group-hover:to-emerald-600/30 transition-all duration-300 shadow-lg">
                  <Clock className="w-8 h-8 text-emerald-300" />
                </div>
              </div>
            </div>

            {/* Aguardando Card */}
            <div className="group bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-400/30 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Finalizados
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    {finalizados}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/20 p-4 rounded-2xl group-hover:from-amber-400/30 group-hover:to-amber-600/30 transition-all duration-300 shadow-lg">
                  <Users className="w-8 h-8 text-amber-300" />
                </div>
              </div>
            </div>
          </div>
          {/* Search and Actions Bar */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-indigo-400/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
              <div className="flex-1 w-full min-w-0">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <ActionButtons
                  selectedByUser={selectedByUser}
                  selectedAgendamento={selectedAgendamento}
                  setAgendamentos={setAgendamentos}
                  setSelectedAgendamento={setSelectedAgendamento}
                  onCallPriority={() => handleCall("prioridade")}
                  onFinalize={() => console.log("Finalizar")}
                  onCancel={() => handleCancelAppointment()}
                />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div
            className="
              bg-gradient-to-br from-slate-800/80 to-slate-900/60
              border border-indigo-500/20 rounded-2xl shadow-xl
              backdrop-blur-sm hover:border-indigo-400/40
              overflow-hidden
            "
          >
            {/* Área rolável */}
            <div>
              <SchedulingTable
                setAgendamentos={setAgendamentos}
                onSelectAgendamento={handleOpenDetails}
                selectedAgendamento={selectedAgendamento}
                isLoading={isLoading}
                agendamentos={paginatedAgendamentos}
              />
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-indigo-500/20">
              <span className="text-sm text-indigo-200">
                Página {currentPage} de {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-md bg-slate-700/60 text-white text-sm
                    disabled:opacity-40 hover:bg-slate-600 transition"
                >
                  ‹
                </button>

                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-md text-sm transition
                      ${
                        page === currentPage
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700/40 text-indigo-200 hover:bg-slate-600"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-md bg-slate-700/60 text-white text-sm
                    disabled:opacity-40 hover:bg-slate-600 transition"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedAgendamento && (
        <DetailsModal
          agendamento={selectedAgendamento}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
