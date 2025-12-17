"use client"

import type { Agendamento } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"
import { Dispatch, SetStateAction, useState } from "react"

const BASE_URL = "http://192.168.200.34:8080/agendamentos"

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
    return <div className="p-8 text-center text-gray-500 text-sm">Carregando agendamentos...</div>
  }

  const [agendamento, setAgendamento] =  useState<Agendamento | null>(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSelectChamarPorSenha = async (e: React.MouseEvent<HTMLButtonElement>, senha: string) => {
    try {
        const response = await fetch(`${BASE_URL}/chamar/por-senha/${senha}`, { method: "POST" })
        console.log('Agendamento ID para Chamar Normal:', senha);

        let data
        try {
          data = await response.json()
        } catch {
          data = null
        }

        setAgendamento(data);
        
        setAgendamentos(prev =>
          prev.map(p =>
            p.agendamentoId === data?.agendamentoId
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

  return (
    <div className="bg-white rounded-lg overflow-y-auto overflow-x-hidden shadow-sm border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Senha</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Usuário</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Serviço</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Situação</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Tipo</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Data/Hora</th>
            <th className="p-3.5 text-center font-semibold tracking-wide sticky top-0">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-8 text-gray-400 italic">
                Nenhum agendamento encontrado
              </td>
            </tr>
          ) : (
            agendamentos.map((agendamento) => (
              <tr
                key={agendamento.agendamentoId}
                className={`
                  transition-all duration-200 cursor-pointer hover:bg-gray-50
                  ${selectedAgendamento?.agendamentoId === agendamento.agendamentoId 
                    ? "bg-blue-50 border-l-4 border-l-blue-600 pl-2" 
                    : ""}
                `}
                onClick={(e) => {
                  const clickedElement = e.target as HTMLElement;
                  
                  if (clickedElement.closest('.chamar-button')) {
                    return; 
                  }

                  onSelectAgendamento(agendamento);
                }}
              >
                <td className="p-3.5 border-b border-gray-200 text-center font-semibold text-blue-600">
                  <strong>{agendamento.senha}</strong>
                </td>
                <td className="p-3.5 border-b border-gray-200 text-center text-gray-800">{agendamento.usuarioNome}</td>
                <td className="p-3.5 border-b border-gray-200 text-center text-gray-800">{agendamento.servicoNome}</td>
                <td className="p-3.5 border-b border-gray-200 text-center">
                  <span className={`
                    px-3 py-1 rounded text-xs font-medium inline-block
                    ${agendamento.situacao === 'AGENDADO' 
                      ? 'bg-blue-50 text-blue-600' 
                      : agendamento.situacao === 'EM_ATENDIMENTO'
                      ? 'bg-green-50 text-green-600'
                      : agendamento.situacao === 'REAGENDADO'
                      ? 'bg-yellow-50 text-yellow-600'
                      : agendamento.situacao === 'CANCELADO'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-50 text-gray-500'
                    }
                  `}>
                    {formatSituation(agendamento.situacao)}
                  </span>
                </td>
                <td className="p-3.5 border-b border-gray-200 text-center text-gray-800">{agendamento.tipoAtendimento}</td>
                <td className="p-3.5 border-b border-gray-200 text-center text-gray-800">{formatDate(agendamento.horaAgendamento)}</td>
                <td className="p-3.5 border-b border-gray-200 text-center">
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm chamar-button hover:bg-red-600 transition-colors"
                    onClick={(e) => onSelectChamarPorSenha(e, agendamento.senha)}
                  >
                    Chamar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}