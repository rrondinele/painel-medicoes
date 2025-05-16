// components/Visualizations/GanttChart.tsx
import { Medicao } from '@/types/medicaoTypes'

interface GanttViewProps {
  medicoes: Medicao[]
}

export default function GanttView({ medicoes }: GanttViewProps) {
  return (
    <div className="overflow-x-auto mt-4">
      <div className="min-w-[800px]">
        <div className="flex mb-2 font-medium">
          <div className="w-48">ID</div>
          <div className="flex-1">Timeline</div>
        </div>
        
        {medicoes.map((medicao) => {
          const start = new Date(medicao.dataExecucao)
          const end = medicao.dataResposta 
            ? new Date(medicao.dataResposta) 
            : new Date(new Date(medicao.dataExecucao).setDate(start.getDate() + 7))
          
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          
          return (
            <div key={medicao.idSistema} className="flex items-center h-10 mb-2">
              <div className="w-48 text-sm">{medicao.idSistema}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-full rounded-full ${
                    medicao.status === 'aprovado' ? 'bg-green-500' :
                    medicao.status === 'reprovado' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(100, duration * 5)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}