export const BASE_URL = "http://192.168.100.21:8080";


export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/gerenciador/login`,
  USUARIO_LOGADO: `${BASE_URL}/gerenciador/usuario-logado`,
  AGENDAMENTOS: `${BASE_URL}/agendamentos`,
  DETALHAMENTO: `${BASE_URL}/agendamentos/detalhamento`,
  CHAMAR: (senha: string, userId: string) => 
    `${BASE_URL}/agendamentos/chamar/por-senha/${senha}/${userId}`,
};