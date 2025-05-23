const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/CenegedSupervisão-SP/Desktop/Projetos-Full/boletim_medicao/bm-medicao-tree/tecnica_dados_fm.xlsx';
const outputPath = path.resolve(__dirname, './public/medicoes.json');

// 1. Ler Excel
const workbook = xlsx.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

// 2. Agrupar por Projeto + Data Execução + Número Folha
const agrupado = {};

rows.forEach(row => {
  // Criar uma chave única combinando os três campos
  const dataExecucao = excelDateToJS(row.Data_Execucao);
  const dataFormatada = dataExecucao ? dataExecucao.toISOString().split('T')[0] : 'sem-data';
  const chaveAgrupamento = `${String(row.Projeto).trim()}_${dataFormatada}_${String(row.Numero_Folha_Medicao || '').trim()}`;
  
  const medida = Number(row.Numero_Medida_Folha_Medicao || 1);

  if (!agrupado[chaveAgrupamento]) {
    agrupado[chaveAgrupamento] = {
      idSistema: String(row.Projeto).trim(),
      folha: String(row.Numero_Folha_Medicao || ''),
      cliente: String(row.Concessionaria).trim(),
      contrato: String(row.Contrato),
      tipoProjeto: String(row.Tipo_Projeto),
      local: String(row.Localidade || row.Regional || 'N/A'),
      regional: String(row.Regional || 'Não informado'),
      cf: String(row.CF || ''),
      pi: String(row.PI || ''),
      ntc: String(row.NTC || ''),
      reserva: String(row.Reserva || ''),
      circuito: String(row.Circuito || ''),
      ks: String(row.KS || ''),
      zona: String(row.Zona || ''),
      observacao: String(row.Observacao || ''),
      atividades: [],
      valorTotal: 0,
      status: mapStatus(row.Status),
      prioridade: 'media',
      documentos: [],
      dataExecucao: dataExecucao,
      dataEnvio: excelDateToJS(row.Data_Envio_Folha_Medicao),
      dataResposta: null,
      responsavel: String(row.Tecnico_Responsavel_Concessionaria || ''),
      medida,
      prazoAprovacao: excelDateToJS(row.Data_Envio_Folha_Medicao),
      // Adicionando campos para referência
      chaveAgrupamento, // Opcional: manter a chave usada para agrupamento
      dataExecucaoOriginal: row.Data_Execucao // Para debug
    };
  }

  agrupado[chaveAgrupamento].atividades.push({
    codigo: String(row.Codigo_Mestre),
    descricao: String(row.Descricao_Item),
    quantidade: Number(row.Quantidade),
    unidade: String(row.Unidade_Medida || 'un'),
    precoUnitario: Number(row[' Valor_Unitario '] || 0),
    criterio: 'executado',
    tipoServico: String(row.Tipo_Servico || ''),
    dispendio: String(row.Dispendio || ''),
    unidadeMedida: String(row.Unidade_Medida || ''),
    observacao: String(row.Observacao || '')
  });

  agrupado[chaveAgrupamento].valorTotal += Number(row[' Valor_Total '] || 0);
});

// 3. Converter objeto em array
const resultado = Object.values(agrupado);

// 4. Salvar JSON no public/
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));
console.log('✅ Dados agrupados salvos em:', outputPath);

// 🧠 Utilitários
function excelDateToJS(serial) {
  if (!serial) return null;
  // Verifica se já é uma data (pode acontecer dependendo da formatação do Excel)
  if (serial instanceof Date) return serial;
  
  const excelEpoch = new Date(1899, 11, 30);
  // Ajuste para datas no formato brasileiro (dd/mm/yyyy)
  if (typeof serial === 'string' && serial.includes('/')) {
    const [day, month, year] = serial.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(excelEpoch.getTime() + (serial - 1) * 86400000);
}

function mapStatus(status) {
  const map = {
    'Em Análise': 'aguardando_aprovacao',
    'Pendente': 'pendente_envio',
    'Aprovado': 'aprovado',
    'Reprovado': 'reprovado',
    'Correção': 'correcao',
  };
  return map[status] || 'aguardando_aprovacao';
}
