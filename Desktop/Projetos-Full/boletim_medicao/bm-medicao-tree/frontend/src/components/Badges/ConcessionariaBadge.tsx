import { cn } from '@/lib/utils'

interface ConcessionariaBadgeProps {
  concessionaria: string
}

export default function ConcessionariaBadge({ concessionaria }: ConcessionariaBadgeProps) {
  const concessionariaMap = {
    Light: {
      color: 'bg-blue-100 text-blue-800'
    },
    Enel: {
      color: 'bg-green-100 text-green-800'
    },
    Neoenergia: {
      color: 'bg-purple-100 text-purple-800'
    },
    Equatorial: {
      color: 'bg-red-100 text-red-800'
    },
    Elektro: {
      color: 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      concessionariaMap[concessionaria as keyof typeof concessionariaMap]?.color || 'bg-gray-100 text-gray-800'
    )}>
      {concessionaria}
    </span>
  )
}