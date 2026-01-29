"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  Search,
  LogOut,
  UserCircle,
  Volume2,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

import SchedulingTable from "../components/SchedulingTable";
import SchedulingModal from "../components/SchedulingModal";
import DetailsModal from "../components/DetailsModal";
import type { Agendamento } from "../types/agendamento";

type FilterStatus = "AGENDADO" | "EM_ATENDIMENTO";
type TipoChamada = "NORMAL" | "PRIORIDADE";

const BASE_URL = "http://192.168.100.21:8080";

export default function SchedulingDashboard() {
  const { clearCache, isLoading, user, token } = useAuth();

  // 1. ESTADOS DE DADOS
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("AGENDADO");
  const [searchTerm, setSearchTerm] = useState("");

  // 2. ESTADOS DE CONTROLE DE MODAIS
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ---- helpers de ids ----
  const secretariaId =
    (user as any)?.secretaria?.id ??
    (user as any)?.secretariaId ??
    null;

  const gerenciadorId = user?.id ?? null;

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const ensureSession = () => {
  // ainda está hidratando do localStorage → NÃO limpa nada
  if (isLoading) return false;

  // só depois de carregar é que valida de verdade
  if (!secretariaId || !gerenciadorId) {
    alert("Sessão inválida. Faça login novamente.");
    clearCache();
    return false;
  }

  return true;
};

  // ✅ 1) CARREGAR LISTA POR SECRETARIA AO ENTRAR
  useEffect(() => {
  // espera terminar a hidratação
  if (isLoading) return;

  // se não tem ids após carregar, não faz fetch (ProtectedRoute/clearCache cuidam disso)
  if (!secretariaId || !gerenciadorId) return;

  const fetchAgendamentos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/agendamentos/secretaria/${secretariaId}`, {
        method: "GET",
        headers: authHeaders,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Falha ao listar agendamentos");
      }

      const data: Agendamento[] = await res.json();
      setAgendamentos(data);
    } catch (err) {
      console.error("Erro ao listar agendamentos:", err);
    }
  };

  fetchAgendamentos();
}, [isLoading, secretariaId, gerenciadorId, token]);

  // 3. FILTRO + STATS
  const { agendamentosFiltrados, stats } = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtrados = agendamentos.filter((a) => {
      const matchesStatus = a.situacao === filterStatus;

      const nome = (a.usuarioNome ?? "").toLowerCase();
      const senha = (a.senha ?? "").toLowerCase();
      const matchesSearch = term.length === 0 || nome.includes(term) || senha.includes(term);

      return matchesStatus && matchesSearch;
    });

    const filaEspera = agendamentos.filter((a) => a.situacao === "AGENDADO");

    return {
      agendamentosFiltrados: filtrados,
      stats: {
        totalFila: filaEspera.length,
        prioridades: filaEspera.filter((a) => a.tipoAtendimento === "PRIORIDADE").length,
        normais: filaEspera.filter((a) => a.tipoAtendimento !== "PRIORIDADE").length,
        emAtendimento: agendamentos.filter((a) => a.situacao === "EM_ATENDIMENTO").length,
        finalizados: agendamentos.filter((a) => a.situacao === "FINALIZADO").length,
      },
    };
  }, [agendamentos, filterStatus, searchTerm]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ✅ 2) CHAMAR PRÓXIMO (NORMAL/PRIORIDADE) VIA ROTAS CERTAS
  const chamarProximo = async (tipo: TipoChamada) => {
    if (!ensureSession()) return;

    const endpoint =
      tipo === "PRIORIDADE"
        ? `${BASE_URL}/agendamentos/chamar/prioridade/${secretariaId}/${gerenciadorId}`
        : `${BASE_URL}/agendamentos/chamar/normal/${secretariaId}/${gerenciadorId}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Não há ninguém disponível nessa fila.");
      }

      const chamado: Agendamento = await res.json();

      // Atualiza lista local: move pra EM_ATENDIMENTO (ou adiciona se não existir)
      setAgendamentos((prev) => {
        const exists = prev.some((a) => a.agendamentoId === chamado.agendamentoId);
        if (!exists) return [chamado, ...prev];

        return prev.map((a) =>
          a.agendamentoId === chamado.agendamentoId
            ? { ...a, ...chamado, situacao: "EM_ATENDIMENTO" }
            : a
        );
      });

      setSelectedAgendamento(chamado);
      setShowActionModal(true);
    } catch (err) {
      console.error("Erro ao chamar próximo:", err);
      alert("Não há ninguém disponível nessa fila.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-blue-600 shadow-sm z-50"
        >
          <ChevronLeft size={16} className={!isSidebarOpen ? "rotate-180" : ""} />
        </button>

        <div className="p-4 flex items-center gap-2 border-b border-slate-50 h-20 overflow-hidden">
          <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
            SA
          </div>
          {isSidebarOpen && (
            <span className="text-[15px] font-extrabold text-slate-800 leading-none uppercase">
              Sistema de
              <br />
              <span className="text-blue-600">Agendamento</span>
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Painel" active collapsed={!isSidebarOpen} />
          <NavItem icon={<Clock size={20} />} label="Fila de Espera" collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={clearCache}
            className={`flex items-center gap-2 text-xs font-bold text-red-600 p-3 w-full hover:bg-red-50 rounded-xl transition-all ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <LogOut size={16} />
            {isSidebarOpen && <span>Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="w-full py-4 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-sm text-slate-400 font-medium">
            Gestão / <span className="text-slate-800 font-bold">Monitor Operacional</span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Localizar senha ou cidadão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-slate-300 rounded-3xl text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="text-[18px] font-bold text-slate-400 uppercase">
            Guichê: <span className="text-blue-500">{(user as any)?.guiche ?? "--"}</span>
          </div>
          <div className="text-[18px] px-4 py-1.5 rounded-lg text-blue-600 font-bold text-sm">
            12:43
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Atendimentos Hoje" value={stats.finalizados + stats.emAtendimento} icon={<UserCircle />} highlight="black" />
            <StatCard label="Pessoas na Fila" value={stats.totalFila} prioridades={stats.prioridades} normais={stats.normais} icon={<Clock />} highlight="orange" />
            <StatCard label="Em Guichê" value={stats.emAtendimento} icon={<Volume2 />} highlight="blue" />
            <StatCard label="Finalizados" value={stats.finalizados} icon={<CheckCircle />} highlight="green" />
          </div>

          {/* PAINEL DE COMANDOS */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Painel de Comandos</h2>
              {selectedAgendamento && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Selecionado: {selectedAgendamento.senha}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => chamarProximo("NORMAL")}
                className="rounded-2xl p-6 flex items-center justify-between transition-all shadow-lg bg-blue-600 text-white"
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold opacity-80 uppercase">Ação</p>
                  <p className="text-lg font-bold">Chamar Normal</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl"><Volume2 /></div>
              </button>

              <button
                onClick={() => chamarProximo("PRIORIDADE")}
                className="rounded-2xl p-6 flex items-center justify-between transition-all shadow-lg bg-amber-400 text-white"
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold opacity-80 uppercase">Ação</p>
                  <p className="text-lg font-bold">Chamar Prioridade</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl"><Zap /></div>
              </button>
            </div>
          </div>

          {/* TABELA COM FILTRO */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex gap-2">
              <button
                onClick={() => setFilterStatus("AGENDADO")}
                className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === "AGENDADO" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                Aguardando
              </button>
              <button
                onClick={() => setFilterStatus("EM_ATENDIMENTO")}
                className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === "EM_ATENDIMENTO" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                Em Atendimento
              </button>
            </div>

            <SchedulingTable
              agendamentos={agendamentosFiltrados}
              selectedAgendamento={selectedAgendamento}
              onSelectAgendamento={(a) => {
                setSelectedAgendamento(a);
                setShowActionModal(true);
              }}
              isLoading={false}
              setAgendamentos={setAgendamentos}
            />
          </div>
        </div>
      </main>

      {/* MODAIS */}
      {showActionModal && selectedAgendamento && (
        <SchedulingModal
          agendamento={selectedAgendamento}
          onClose={() => setShowActionModal(false)}
          onShowDetails={() => {
            setShowActionModal(false);
            setShowDetailsModal(true);
          }}
          onCancel={() => setShowActionModal(false)}
        />
      )}

      {showDetailsModal && selectedAgendamento && (
        <DetailsModal agendamento={selectedAgendamento} onClose={() => setShowDetailsModal(false)} />
      )}
    </div>
  );
}

// AUX
function NavItem({ icon, label, active = false, collapsed = false }: any) {
  return (
    <button
      className={`flex items-center w-full rounded-xl font-bold text-sm transition-all h-11 ${
        collapsed ? "justify-center px-0" : "gap-4 px-4"
      } ${active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
    >
      {icon}
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}

function StatCard({ label, value, icon, highlight, prioridades, normais }: any) {
  const colors: any = { black: "bg-slate-900", orange: "bg-amber-400", blue: "bg-blue-600", green: "bg-emerald-500" };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        {(prioridades !== undefined || normais !== undefined) && (
          <div className="flex gap-3 mt-2">
            <span className="text-[12px] font-bold text-blue-600">{normais} Normal</span>
            <span className="text-[12px] font-bold text-amber-600">{prioridades} Prioridade</span>
          </div>
        )}
        <div className={`h-1 w-10 mt-3 rounded-full ${colors[highlight]}`}></div>
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl text-slate-400">{icon}</div>
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>

        {(prioridades !== undefined || normais !== undefined) && (
          <div className="flex gap-3 mt-2">
            <span className="text-[12px] font-bold text-blue-600">{normais} Normal</span>
            <span className="text-[12px] font-bold text-amber-600">{prioridades} Prioridade</span>
          </div>
        )}

        <div className={`h-1 w-10 mt-3 rounded-full ${colors[highlight]}`}></div>
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl text-slate-400">{icon}</div>
    </div>
  );
}
