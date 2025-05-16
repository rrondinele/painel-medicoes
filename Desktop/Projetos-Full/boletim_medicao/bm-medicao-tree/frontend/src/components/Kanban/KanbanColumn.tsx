import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  count: number
  status: string
  children: React.ReactNode
}

export default function KanbanColumn({ 
  title, 
  count, 
  status, 
  children 
}: KanbanColumnProps) {
  return (
    <div className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}