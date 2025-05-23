// types/medicaoTypes.ts

export type StatusMedicao =
  | 'pendente_envio'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'reprovado'
  | 'correcao';

export type Prioridade = 'baixa' | 'media' | 'alta';

export type Concessionaria =
  | 'Light'
  | 'Enel'
  | 'Cemig'
  | 'CPFL'
  | 'Neoenergia'
  | 'Elektro'
  | 'Equatorial'
  | string;

export interface Atividade {
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  criterio: 'equipamento' | 'executado' | 'documentado';
  tipoServico?: string;       
  dispendio?: string;         
  unidadeMedida?: string;
  circuito?: string;          // Nova coluna
  observacao?: string;       // Nova coluna     
}

export interface Documento {
  tipo: 'FOTO' | 'PDF' | 'PLANILHA' | string;
  nome: string;
  data: Date;
  url: string;
}

export interface Medicao {
  idSistema: string;
  folha: string;
  cliente: Concessionaria;
  contrato: string;
  tipoProjeto: string;
  local: string;
  regional: string;
  circuito: string;          // Nova coluna
  reserva: string;           // Nova coluna
  ntc: string;               // Nova coluna
  pi: string;                // Nova coluna
  ks: string;                // Nova coluna
  cf: string;                // Nova coluna
  zona: string;              // Nova coluna
  observacao: string;        // Nova coluna
  atividades: Atividade[];
  valorTotal: number;
  status: StatusMedicao;
  prioridade: Prioridade;
  documentos: Documento[];
  dataExecucao: Date;
  dataEnvio: Date;
  dataResposta: Date | null;
  responsavel: string;
  medida: number;
  prazoAprovacao: Date;
  [key: string]: any; // permite atributos adicionais dinamicamente
}
