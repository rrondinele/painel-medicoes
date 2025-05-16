const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/CenegedSupervisão-SP/Desktop/Projetos-Full/boletim_medicao/bm-medicao-tree/tecnica_dados_fm.xlsx';
const outputPath = path.resolve(__dirname, './public/medicoes.json'); // ✅ agora no public

// 1. Ler Excel
const workbook = xlsx.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

// 2. Agrupar por Projeto
const agrupado = {};

rows.forEach(row => {
  const idSistema = String(row.Projeto).trim();
  const medida = Number(row.Numero_Medida_Folha_Medicao || 1);

  if (!agrupado[idSistema]) {
    agrupado[idSistema] = {
      idSistema,
      folha: String(row.Numero_Folha_Medicao || ''),
      cliente: String(row.Concessionaria).trim(),
      contrato: String(row.Contrato),
      local: String(row.Localidade || row.Regional || 'N/A'),
      regional: String(row.Regional || 'Não informado'), // 👈 AQUI
      atividades: [],
      valorTotal: 0,
      status: mapStatus(row.Status),
      prioridade: 'media',
      documentos: [],
      dataExecucao: excelDateToJS(row.Data_Execucao),
      dataEnvio: excelDateToJS(row.Data_Envio_Folha_Medicao),
      dataResposta: null,
      responsavel: String(row.Tecnico_Responsavel_Concessionaria || ''),
      medida,
      prazoAprovacao: excelDateToJS(row.Data_Envio_Folha_Medicao),
    };
  }

  agrupado[idSistema].atividades.push({
    codigo: String(row.Codigo_Mestre),
    descricao: String(row.Descricao_Item),
    quantidade: Number(row.Quantidade),
    unidade: String(row.Unidade_Medida || 'un'),
    precoUnitario: Number(row[' Valor_Unitario '] || 0),
    criterio: 'executado',
    tipoServico: String(row.Tipo_Servico || ''),
    dispendio: String(row.Dispendio || ''),
    unidadeMedida: String(row.Unidade_Medida || '')
  });

  agrupado[idSistema].valorTotal += Number(row[' Valor_Total '] || 0);
});

// 3. Converter objeto em array
const resultado = Object.values(agrupado);

// 4. Salvar JSON no public/
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));
console.log('✅ Dados agrupados salvos em:', outputPath);

// 🧠 Utilitários
function excelDateToJS(serial) {
  const excelEpoch = new Date(1899, 11, 30);
  return serial ? new Date(excelEpoch.getTime() + serial * 86400000) : null;
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
