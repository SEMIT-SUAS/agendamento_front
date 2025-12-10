"use client"

import type { Agendamento } from "../types/agendamento"
import "../styles/modal.css"

interface SchedulingModalProps {
  agendamento: Agendamento
  onClose: () => void
  onShowDetails: () => void
  onCancel: () => void
}

export default function SchedulingModal({ agendamento, onClose, onShowDetails, onCancel }: SchedulingModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agendamento Selecionado</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="appointment-info">
            <span className="info-senha">{agendamento.senha}</span>
            <span className="info-nome">{agendamento.usuarioNome}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onShowDetails}>
            📋 Detalhes
          </button>
          <button className="btn btn-danger" onClick={onCancel}>
            ❌ Não Compareceu
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
