import { useEffect, useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filters } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  KanbanSquare,
  MapPin,
  Building2,
  GanttChartSquare,
  Download,
  Search,
  Table2
} from 'lucide-react'

import MetricsDashboard from '@/components/Metrics/MetricsDashboard'
import AdvancedFilters from '@/components/Filters/AdvancedFilters'
import MedicaoTable from '@/components/Table/MedicaoTable'
import KanbanBoard from '@/components/Kanban/KanbanBoard'
import MapView from '@/components/Visualizations/MapView'
import GanttView from '@/components/Visualizations/GanttChart'
import { Medicao } from '@/types/medicaoTypes'

const allowedStatus = ['pendente_envio', 'aguardando_aprovacao', 'aprovado', 'reprovado', 'correcao']

export default function PainelMedicoes() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({
    concessionaria: '',
    status: '',
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })

  useEffect(() => {
    fetch('/medicoes.json')
      .then((res) => res.json())
      .then((rawMedicoes) => {
        const mapped = rawMedicoes.map((item: any): Medicao => ({
          idSistema: item.idSistema,
          folha: item.folha,
          cliente: item.cliente,
          contrato: item.contrato,
          local: item.local,
          regional: item.regional || '',
          atividades: item.atividades.map((a: any) => ({
            ...a,
            criterio: ['equipamento', 'executado', 'documentado'].includes(a.criterio)
              ? a.criterio
              : 'executado',
          })),
          valorTotal: item.valorTotal,
          status: allowedStatus.includes(item.status) ? item.status : 'pendente_envio',
          prioridade: ['baixa', 'media', 'alta'].includes(item.prioridade) ? item.prioridade : 'media',
          documentos: item.documentos || [],
          dataExecucao: new Date(item.dataExecucao),
          dataEnvio: new Date(item.dataEnvio),
          dataResposta: item.dataResposta ? new Date(item.dataResposta) : null,
          responsavel: item.responsavel,
          medida: item.medida,
          prazoAprovacao: new Date(item.prazoAprovacao),
        }))
        setMedicoes(mapped)
      })
  }, [])

  const filteredMedicoes = useMemo(() => {
    return medicoes.filter((medicao) => {
      const matchesSearch = searchTerm
        ? medicao.idSistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicao.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      const matchesFilters =
        (filters.concessionaria ? medicao.cliente === filters.concessionaria : true) &&
        (filters.status ? medicao.status === filters.status : true) &&
        (filters.dateRange.from && filters.dateRange.to
          ? new Date(medicao.dataExecucao) >= new Date(filters.dateRange.from) &&
            new Date(medicao.dataExecucao) <= new Date(filters.dateRange.to)
          : true)

      return matchesSearch && matchesFilters
    })
  }, [medicoes, searchTerm, filters])

  const concessionarias = useMemo(() => {
    return Array.from(new Set(medicoes.map((m) => m.cliente)))
  }, [medicoes])

  const statusOptions = ['pendente_envio', 'aguardando_aprovacao', 'aprovado', 'reprovado', 'correcao']

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        {/*<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">*/}
        <div className="w-full max-w-[1450px] mx-auto px-6 py-4 flex justify-between items-center"> 
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Painel de Medições
            </h1>
            <p className="text-sm text-gray-500">Controle de medições elétricas</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      {/*<main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">*/}
      <main className="w-full max-w-[1450px] mx-auto px-6 py-6">
        <MetricsDashboard medicoes={filteredMedicoes} />
        <div className="my-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="relative w-full max-w-md flex-shrink-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Pesquisar medições..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow">
              <AdvancedFilters
                filters={filters}
                onFilterChange={setFilters}
                concessionarias={concessionarias}
                statusOptions={statusOptions}
              />
            </div>
          </div>

          <Tabs defaultValue={viewMode}>
            <TabsList className="flex w-full max-w-md mb-6 gap-2">
              <TabsTrigger
                value={viewMode}
                onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
              >
                {viewMode === 'table' ? (
                  <>
                    <Table2 className="mr-2 h-4 w-8" />
                    Visualização Tabela
                  </>
                ) : (
                  <>
                    <KanbanSquare className="mr-2 h-4 w-8" />
                    Visualização Kanban
                  </>
                )}
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="mr-2 h-4 w-8" />
                Mapa
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <GanttChartSquare className="mr-2 h-4 w-8" />
                Cronograma
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <MedicaoTable medicoes={filteredMedicoes} onMedicaoUpdated={() => {}} />
            </TabsContent>
            <TabsContent value="kanban">
              <KanbanBoard medicoes={filteredMedicoes} />
            </TabsContent>
            <TabsContent value="map">
              <MapView medicoes={filteredMedicoes} />
            </TabsContent>
            <TabsContent value="timeline">
              <GanttView medicoes={filteredMedicoes} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Concessionária</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Concessionária</TableHead>
                    <TableHead className="text-right">Medições</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concessionarias.map((concessionaria) => {
                    const total = filteredMedicoes.filter((m) => m.cliente === concessionaria).length
                    const valorTotal = filteredMedicoes
                      .filter((m) => m.cliente === concessionaria)
                      .reduce((sum, m) => sum + m.valorTotal, 0)

                    return (
                      <TableRow key={concessionaria}>
                        <TableCell>{concessionaria}</TableCell>
                        <TableCell className="text-right">{total}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(valorTotal)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status das Medições</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">% do Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusOptions.map((status) => {
                    const count = filteredMedicoes.filter((m) => m.status === status).length
                    const percentage = (count / filteredMedicoes.length) * 100

                    return (
                      <TableRow key={status}>
                        <TableCell>
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                        <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}