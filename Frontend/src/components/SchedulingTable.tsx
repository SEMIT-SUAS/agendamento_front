"use client"

import type { Agendamento } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"
import "../styles/scheduling-table.css"

interface SchedulingTableProps {
  agendamentos: Agendamento[]
  selectedAgendamento: Agendamento | null
  onSelectAgendamento: (agendamento: Agendamento) => void
  isLoading: boolean
}

export default function SchedulingTable({
  agendamentos,
  selectedAgendamento,
  onSelectAgendamento,
  isLoading,
}: SchedulingTableProps) {
  if (isLoading) {
    return <div className="table-loading">Carregando agendamentos...</div>
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
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                Nenhum agendamento encontrado
              </td>
            </tr>
          ) : (
            agendamentos.map((agendamento) => (
              <tr
                key={agendamento.agendamentoId}
                className={`
                  scheduling-row
                  ${selectedAgendamento?.agendamentoId === agendamento.agendamentoId ? "selected" : ""}
                  status-${agendamento.situacao}
                `}
                onClick={() => onSelectAgendamento(agendamento)}
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
