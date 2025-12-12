"use client"

import type { Agendamento } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"
import "../styles/scheduling-table.css"
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
    return <div className="table-loading">Carregando agendamentos...</div>
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
    <div className="table-container">
      <table className="scheduling-table">
        <thead>
          <tr>
            <th>Senha</th>
            <th>Usuário</th>
            <th>Serviço</th>
            <th>Situação</th>
            <th>Tipo</th>
            <th>Data/Hora</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-state">
                Nenhum agendamento encontrado
              </td>
            </tr>
          ) : (
            agendamentos.map((agendamento) => (
              // console.log('Agendamento:', agendamentos),
              <tr
                key={agendamento.agendamentoId}
                className={`
                  scheduling-row
                  ${selectedAgendamento?.agendamentoId === agendamento.agendamentoId ? "selected" : ""}
                  status-${agendamento.situacao}
                `}
                onClick={(e) => {
                  // Verifica se o alvo do clique (event.target) é o botão, ou um descendente dele
                  const clickedElement = e.target as HTMLElement;
                  
                  // Usa .closest() para verificar se o elemento clicado ou qualquer pai dele é o botão
                  if (clickedElement.closest('.chamar-button')) {
                    // Se clicou no botão, não faça nada aqui, pois o handler do botão já foi executado.
                    return; 
                  }

                  // Caso contrário, selecione a linha normalmente
                  onSelectAgendamento(agendamento);
                }}
              >
                <td className="senha-cell">
                  <strong>{agendamento.senha}</strong>
                </td>
                <td>{agendamento.usuarioNome}</td>
                <td>{agendamento.servicoNome}</td>
                <td>
                  <span className={`status-badge status-${agendamento.situacao}`}>
                    {formatSituation(agendamento.situacao)}
                  </span>
                </td>
                <td>{agendamento.tipoAtendimento}</td>
                <td>{formatDate(agendamento.horaAgendamento)}</td>
                <td>
                  {
                   <button 
                  className="bg-red-500 text-white px-3 py-1 chamar-button" 
                  onClick={(e) => onSelectChamarPorSenha(e,agendamento.senha)}>
                  Chamar
                  </button>
                  }
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
