"use client"

import type { Agendamento } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"
import "../styles/modal.css"

interface DetailsModalProps {
  agendamento: Agendamento
  onClose: () => void
}

export default function DetailsModal({ agendamento, onClose }: DetailsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes do Cidadão</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item">
              <label>Nome:</label>
              <span>{agendamento.usuarioNome}</span>
            </div>
            <div className="detail-item">
              <label>Serviço:</label>
              <span>{agendamento.servicoNome}</span>
            </div>
            <div className="detail-item">
              <label>Senha:</label>
              <span>{agendamento.senha}</span>
            </div>
            <div className="detail-item">
              <label>Situação:</label>
              <span>{formatSituation(agendamento.situacao)}</span>
            </div>
            <div className="detail-item">
              <label>Tipo de Atendimento:</label>
              <span>{agendamento.tipoAtendimento}</span>
            </div>
            <div className="detail-item">
              <label>Data/Hora:</label>
              <span>{formatDate(agendamento.horaAgendamento)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            ✖ Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
