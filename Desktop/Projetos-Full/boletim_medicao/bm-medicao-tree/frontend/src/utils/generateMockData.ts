import type { Medicao, Concessionaria } from '../types/medicaoTypes';

export const generateMockData = (count = 20): Medicao[] => {
  const concessionarias: Concessionaria[] = ['Light', 'Enel', 'Cemig', 'CPFL', 'Neoenergia', 'Elektro', 'Equatorial'];
  const statuses = ['pendente_envio', 'aguardando_aprovacao', 'aprovado', 'reprovado', 'correcao'] as const;
  const locais = ['Subestação RJ-05', 'Subestação SP-12', 'Usina BH-03', 'Linha de Transmissão MG-45'];

  return Array.from({ length: count }, (_, i) => {
    const dataBase = new Date(2025, i % 12, (i % 28) + 1);

    return {
      idSistema: `ID${1000 + i}`,
      folha: `00${(i % 5) + 1}`,
      cliente: concessionarias[i % concessionarias.length],
      contrato: `CT2023-${100 + i}`,
      local: locais[i % locais.length],
      atividades: [
        {
          codigo: `ELE-${100 + i}`,
          descricao: i % 2 === 0 ? 'Instalação de transformador' : 'Manutenção preventiva',
          quantidade: (i % 3) + 1,
          unidade: 'un',
          precoUnitario: 2500 + (i * 500),
          criterio: i % 3 === 0 ? 'equipamento' : i % 3 === 1 ? 'executado' : 'documentado'
        }
      ],
      valorTotal: 7500 + (i * 1500),
      status: statuses[i % statuses.length],
      prioridade: i % 3 === 0 ? 'alta' : i % 3 === 1 ? 'media' : 'baixa',
      documentos: [
        {
          tipo: 'FOTO',
          nome: `foto_${i}.jpg`,
          data: new Date(dataBase),
          url: '#'
        }
      ],
      dataExecucao: new Date(dataBase),
      dataEnvio: new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + 2),
      dataResposta: i % 4 === 0 ? null : new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + 4),
      responsavel: `Técnico ${String.fromCharCode(65 + (i % 26))}`,
      medida: (i % 5) + 1,
      prazoAprovacao: new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + 9),
    };
  });
};
