"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Clock, CheckCircle, Search, 
  LogOut, Bell, Settings, FileText, UserCircle, ArrowRight, Volume2, Zap, ChevronLeft
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

// Componentes simulados (ajuste conforme seus arquivos reais)
import SearchBar from "../components/SearchBar";
import SchedulingTable from "../components/SchedulingTable";

export default function SchedulingDashboard() {
  const { user, clearCache } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pessoasNaFila = agendamentos.filter(a => a.status === "AGUARDANDO");
  const totalFila = pessoasNaFila.length;
  const totalPrioridade = pessoasNaFila.filter(a => a.tipoAtendimento === "PRIORIDADE").length;
  const totalNormal = totalFila - totalPrioridade;
  const [filterStatus, setFilterStatus] = useState("AGUARDANDO");
  const agendamentosFiltrados = agendamentos.filter(
    (item) => item.status === filterStatus
  );
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   window.location.href = "/login";
  //   return null;
  // }
  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* SIDEBAR LATERAL */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out relative ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-blue-600 shadow-sm z-50 transition-transform"
          style={{ transform: isSidebarOpen ? "rotate(0deg)" : "rotate(180deg)" }}
        >
          <ChevronLeft size={16} />
        </button>
        {/* LOGO */}
        <div className="p-4 flex items-center gap-2 border-b border-slate-50 overflow-hidden h-20">
          <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
            SA
          </div>
          {isSidebarOpen && (
            <span className="text-[15px] font-extrabold text-slate-800 leading-none">
              Sistema de<br/>
              <span className="text-blue-600 text-[15px] uppercase tracking-tighter">Agendamento</span>
            </span>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label={isSidebarOpen ? "Painel" : ""} 
            active 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Clock size={20}/>} 
            label={isSidebarOpen ? "Fila de Espera" : ""} 
            collapsed={!isSidebarOpen}
          />
        </nav>


        {/* PERFIL E SAIR */}
        <div className="p-4 border-t border-slate-100 overflow-hidden">
          <div className={`flex items-center gap-3 transition-all ${
            isSidebarOpen ? "p-3 rounded-2xl" : "justify-center p-0 mb-4"
          }`}>
            <div className="min-w-[32px] h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              MS
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                <p className="text-sm font-bold text-slate-800 truncate">Maria Silva</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Atendente</p>
              </div>
            )}
          </div>

          <button 
            onClick={clearCache} 
            className={`flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all rounded-xl ${
              isSidebarOpen ? "p-3 w-full" : "p-3 justify-center w-full"
            }`}
            title={!isSidebarOpen ? "Sair do Sistema" : ""}
          >
            <LogOut size={16} className="shrink-0" />
            {isSidebarOpen && <span className="animate-in fade-in duration-300">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Top Header */}
        <header className="w-full  py-2 border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>Gestão</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">Monitor Operacional</span>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Localizar senha ou cidadão..."
                className="
                  w-full h-11 pl-12 pr-4
                  bg-gray-50 border border-slate-300
                  rounded-3xl text-sm font-medium text-slate-700
                  placeholder:text-slate-400
                  outline-none transition-all duration-200
                  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                "
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[18px] font-bold text-slate-400 uppercase">Guichê: <span className="text-blue-500 ">04</span></span>
            </div>
            <div className=" text-[18px] px-4 py-1.5 rounded-lg text-blue-600 font-bold text-sm">
              12:43
            </div>
          </div>
        </header>

        
        <div className="p-8 space-y-8 w-full">
          {/* INDICADORES MENORES */}
          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Atendimentos Hoje" value="42" icon={<UserCircle className="text-slate-400"/>} highlight="black"/>
           <StatCard 
                label="Pessoas na Fila" 
                value="18" 
                prioridades="4" 
                normais="12" 
                icon={<Clock className="text-orange-400"/>} 
                highlight="orange" 
              />
            <StatCard label="Em Guichê" value="5" icon={<Volume2 className="text-blue-400"/>} highlight="blue" />
            <StatCard label="Finalizados" value="19" icon={<CheckCircle className="text-emerald-400"/>} highlight="green"/>
          </div>
          {/* PAINEL DE COMANDOS (BOTÕES DE CHAMADA) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
             <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Painel de Comandos</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 flex items-center justify-between transition-all group shadow-lg shadow-blue-100">
                  <div className="text-left">
                    <p className="text-[10px] font-bold opacity-80 uppercase">Fila Normal</p>
                    <p className="text-lg font-bold">Chamar Próximo</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Volume2 />
                  </div>
                </button>

                <button className="bg-amber-400 hover:bg-amber-500 text-white rounded-2xl p-6 flex items-center justify-between transition-all group shadow-lg shadow-orange-100">
                  <div className="text-left">
                    <p className="text-[10px] font-bold opacity-80 uppercase">Prioritário</p>
                    <p className="text-lg font-bold">Chamar Prioridade</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap />
                  </div>
                </button>

             </div>
          </div>
          {/* TABELA DE ATENDIMENTO */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilterStatus("AGUARDANDO")}
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === "AGUARDANDO"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Aguardando
                </button>

                <button
                  onClick={() => setFilterStatus("EM_ATENDIMENTO")}
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === "EM_ATENDIMENTO"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Em Atendimento
                </button>
              </div>
                            
            </div>
            
            <SchedulingTable agendamentos={agendamentosFiltrados} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* COMPONENTES DE APOIO INTERNOS */
function NavItem({ icon, label, active = false, collapsed = false }) {
  return (
    <button className={`flex items-center w-full rounded-xl font-bold text-sm transition-all h-11 ${
      collapsed ? "justify-center px-0" : "gap-4 px-4"
    } ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
    }`}>
      <div className="shrink-0">{icon}</div>
      {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </button>
  );
}
function StatCard({ label, value, icon, highlight, prioridades, normais }) {
  const colors = {
    black: 'bg-slate-900',
    orange: 'bg-amber-400',
    blue: 'bg-blue-600',
    green: 'bg-emerald-500'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        
        {/* INDICADORES DE PRIORIDADE E NORMAL */}
        {(prioridades || normais) && (
          <div className="flex gap-3 mt-3">
            <span className="text-[16px] font-semibold text-blue-600">
              {normais} Normal
            </span>
            <span className="text-[16px] font-semibold text-amber-600">
              {prioridades} Prioridade
            </span>
          </div>
        )}

        {highlight && (
          <div className={`h-1 w-10 mt-3 rounded-full ${colors[highlight]}`}></div>
        )}
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl shrink-0">{icon}</div>
    </div>
  );
}