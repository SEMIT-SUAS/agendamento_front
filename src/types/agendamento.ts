
// export type UserProfile = "ADMIN" | "CADASTRO" | "CONSULTA";

export interface Usuario {
  email: string;
  senha: string;
}

export interface Agendamento {
  agendamentoId: number
  secretariaId?: number
  senha: string
  usuarioNome: string
  usuarioTipo?: string
  servicoNome: string
  situacao: "AGENDADO" | "EM_ATENDIMENTO" | "REAGENDADO" | "CANCELADO" | "NAO_COMPARECEU"
  tipoAtendimento: string
  horaAgendamento: string
  horaChamada?: string
}
