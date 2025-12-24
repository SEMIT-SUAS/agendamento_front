import type { Agendamento, Usuario } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"
import { Dispatch, SetStateAction, useState } from "react"
import { useAuth } from "./AuthContext"
import { Phone, AlertCircle, Clock, Zap, CheckCircle, XCircle, Users, Calendar } from "lucide-react"

const BASE_URL = "http://192.168.200.157:8080/agendamentos"

interface SchedulingTableProps {
  setAgendamentos: Dispatch<SetStateAction<Agendamento[]>>;
  agendamentos: Agendamento[];
  selectedAgendamento: Agendamento | null;
  onSelectAgendamento: (agendamento: Agendamento) => void;
  isLoading: boolean;
}

export default function SchedulingTable({
  setAgendamentos,
  agendamentos,
  selectedAgendamento,
  onSelectAgendamento,
  isLoading,
}: SchedulingTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
        <p className="text-gray-400 text-sm font-medium">Carregando agendamentos...</p>
      </div>
    )
  }

  const { user } = useAuth();
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [agendamentosDetalhe, setAgendamentosDetalhe] = useState<Agendamento[]>([])

  const onSelectChamarPorSenha = async (e: React.MouseEvent<HTMLButtonElement>, senha: string) => {
    try {
// 🔹 Buscar detalhamento
          const detalheResponse = await fetch(`${BASE_URL}/detalhamento`)
          const data: Agendamento[] = await detalheResponse.json()

          setAgendamentosDetalhe(data)

          // ✅ FILTRA DIRETO NO DATA
          const agendamentosEmAtendimento = data.filter(
            a => a.situacao === "EM_ATENDIMENTO"
          )

          if (agendamentosEmAtendimento.length > 0) {
            alert("Já existe um agendamento em atendimento. Finalize-o antes de chamar outro.")
            return
          }

      const response = await fetch(`${BASE_URL}/chamar/por-senha/${senha}/${user?.id}`, { method: "POST" })
      console.log('Agendamento ID para Chamar Normal:', senha);

      let chamada
      try {
        chamada = await response.json()
      } catch {
        chamada = null
      }

      setAgendamento(chamada);

      setAgendamentos(prev =>
        prev.map(p =>
          p.agendamentoId === chamada?.agendamentoId
            ? { ...p, situacao: "EM_ATENDIMENTO" }
            : p
        )
      );

      e.stopPropagation();

    } catch (error) {
      console.error("Erro ao chamar:", error)
      alert("Erro ao chamar agendamento")
    }
  }

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case 'AGENDADO':
        return <Calendar className="w-3.5 h-3.5" />
      case 'EM_ATENDIMENTO':
        return <Zap className="w-3.5 h-3.5" />
      case 'REAGENDADO':
        return <Clock className="w-3.5 h-3.5" />
      case 'FINALIZADO':
        return <CheckCircle className="w-3.5 h-3.5" />
      default:
        return <AlertCircle className="w-3.5 h-3.5" />
    }
  }

  const getSituacaoBg = (situacao: string) => {
    switch (situacao) {
      case 'AGENDADO':
        return 'bg-blue-50 border border-blue-200'
      case 'EM_ATENDIMENTO':
        return 'bg-emerald-50 border border-emerald-200'
      case 'REAGENDADO':
        return 'bg-amber-50 border border-amber-200'
      case 'FINALIZADO':
        return 'bg-red-50 border border-red-200'
      default:
        return 'bg-gray-50 border border-gray-200'
    }
  }

  const getSituacaoTextColor = (situacao: string) => {
    switch (situacao) {
      case 'AGENDADO':
        return 'text-blue-700'
      case 'EM_ATENDIMENTO':
        return 'text-emerald-700'
      case 'REAGENDADO':
        return 'text-amber-700'
      case 'FINALIZADO':
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="w-full">
      {agendamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="bg-white p-4 rounded-full border border-gray-200 shadow-sm">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-semibold text-base">Nenhum agendamento encontrado</p>
            <p className="text-gray-400 text-sm mt-1">Tente ajustar sua busca ou filtros</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((agendamento) => (
            <div
              key={agendamento.agendamentoId}
              className={`
                group relative rounded-xl border-2 transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:border-blue-200
                ${selectedAgendamento?.agendamentoId === agendamento.agendamentoId
                  ? 'bg-gradient-to-r from-blue-50 via-white to-white border-blue-300 shadow-lg shadow-blue-200/30'
                  : 'bg-white border-gray-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-white'
                }
              `}
              onClick={(e) => {
                const clickedElement = e.target as HTMLElement;
                if (clickedElement.closest('.chamar-button')) {
                  return;
                }
                onSelectAgendamento(agendamento);
              }}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 ${
                selectedAgendamento?.agendamentoId === agendamento.agendamentoId
                  ? 'bg-gradient-to-b from-blue-600 to-blue-400'
                  : 'bg-gradient-to-b from-gray-300 to-gray-200 group-hover:from-blue-400 group-hover:to-blue-300'
              }`} />

              <div className="pl-4 pr-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-3 items-center">
                  {/* Senha */}
                  <div className="flex items-center gap-3 md:col-span-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Senha</p>
                      <p className="text-lg font-bold text-blue-700">{agendamento.senha}</p>
                    </div>
                  </div>

                  {/* Usuário */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Usuário</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{agendamento.usuarioNome}</p>
                  </div>

                  {/* Serviço */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Serviço</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{agendamento.servicoNome}</p>
                  </div>

                  {/* Situação */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Situação</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs ${getSituacaoBg(agendamento.situacao)}`}>
                      <span className={getSituacaoTextColor(agendamento.situacao)}>
                        {getSituacaoIcon(agendamento.situacao)}
                      </span>
                      <span className={getSituacaoTextColor(agendamento.situacao)}>
                        {formatSituation(agendamento.situacao)}
                      </span>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Tipo</p>
                    <p className="text-sm font-medium text-gray-700">{agendamento.tipoAtendimento || "—"}</p>
                  </div>

                  {/* Data/Hora */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Data/Hora</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(agendamento.horaAgendamento)}</p>
                  </div>

                  {/* Ações */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      className="chamar-button group/btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                      onClick={(e) => onSelectChamarPorSenha(e, agendamento.senha)}
                    >
                      <span>Chamar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
