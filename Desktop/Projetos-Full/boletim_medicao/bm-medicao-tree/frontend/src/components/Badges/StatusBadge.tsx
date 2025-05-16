import { cn } from '@/lib/utils'
import {
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  FileEdit
} from 'lucide-react'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap = {
    pendente_envio: {
      label: 'Pendente de Envio',
      color: 'bg-gray-100 text-gray-800',
      icon: <Clock className="w-3.5 h-3.5 mr-1" />
    },
    aguardando_aprovacao: {
      label: 'Em Análise',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Search className="w-3.5 h-3.5 mr-1" /> // <- LUPA
    },
    aprovado: {
      label: 'Aprovado',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
    },
    reprovado: {
      label: 'Reprovado',
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className="w-3.5 h-3.5 mr-1" />
    },
    correcao: {
      label: 'Correção',
      color: 'bg-orange-100 text-orange-800',
      icon: <FileEdit className="w-3.5 h-3.5 mr-1" />
    }
  }

  const current = statusMap[status as keyof typeof statusMap]

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      current?.color || 'bg-gray-100 text-gray-800'
    )}>
      {current?.icon}
      {current?.label || status}
    </span>
  )
}
