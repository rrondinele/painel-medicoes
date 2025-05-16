import { Medicao } from '@/types/medicaoTypes'
import KanbanColumn from './KanbanColumn'
import StatusBadge from '@/components/Badges/StatusBadge'

const statusColumns = [
  { id: 'pendente_envio', title: 'Pendentes de Envio' },
  { id: 'aguardando_aprovacao', title: 'Em Análise' },
  { id: 'aprovado', title: 'Aprovadas' },
  { id: 'reprovado', title: 'Reprovadas' },
  { id: 'correcao', title: 'Correção' }
]

interface KanbanBoardProps {
  medicoes: Medicao[]
}

export default function KanbanBoard({ medicoes }: KanbanBoardProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const columnMedicoes = medicoes.filter(m => m.status === column.id)
        return (
          <KanbanColumn
            key={column.id}
            title={column.title}
            count={columnMedicoes.length}
            status={column.id}
          >
            {columnMedicoes.map((medicao) => (
              <KanbanCard key={medicao.idSistema} medicao={medicao} />
            ))}
          </KanbanColumn>
        )
      })}
    </div>
  )
}

function KanbanCard({ medicao }: { medicao: Medicao }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{medicao.idSistema}</h3>
          <p className="text-sm text-gray-600">{medicao.local}</p>
        </div>
        <StatusBadge status={medicao.status} />
      </div>
      <div className="mt-2">
        <p className="text-sm">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(medicao.valorTotal)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Execução: {new Date(medicao.dataExecucao).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  )
}