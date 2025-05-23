import { useState } from 'react'
import { Medicao } from '@/types/medicaoTypes'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import StatusBadge from '@/components/Badges/StatusBadge'
import ConcessionariaBadge from '@/components/Badges/ConcessionariaBadge'
import { Button } from '@/components/ui/button'
import { PlusCircle, Eye, FileEdit, Download, MoreHorizontal, FileText, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip"

interface MedicaoTableProps {
  medicoes: Medicao[]
  onMedicaoUpdated: (updatedMedicao: Medicao) => void
}

export default function MedicaoTable({ medicoes, onMedicaoUpdated }: MedicaoTableProps) {
  const [selectedMedicao, setSelectedMedicao] = useState<Medicao | null>(null)
  const [action, setAction] = useState<'view' | 'edit' | null>(null)
  const [editForm, setEditForm] = useState<Partial<Medicao> | null>(null)

  const handleView = (medicao: Medicao) => {
    setSelectedMedicao(medicao)
    setAction('view')
    setEditForm(null)
  }

  const handleEdit = (medicao: Medicao) => {
    setSelectedMedicao(medicao)
    setAction('edit')
    setEditForm({ ...medicao })
  }

  const handleDownload = async (medicao: Medicao) => {
    try {
      toast({
        title: "Download iniciado",
        description: `Preparando relatório da medição ${medicao.idSistema}`,
      })
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Download concluído",
        description: `Relatório da medição ${medicao.idSistema} baixado com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao baixar o relatório",
        variant: "destructive"
      })
    }
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!selectedMedicao || !editForm) return
    const updatedMedicao = { ...selectedMedicao, ...editForm }
    onMedicaoUpdated(updatedMedicao)
    
    toast({
      title: "Medição atualizada",
      description: `Medição ${selectedMedicao.idSistema} foi salva com sucesso`,
    })
    
    setSelectedMedicao(null)
    setAction(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="relative max-h-[600px] overflow-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow>
                <TableHead className="sticky top-0 bg-white z-10">Projeto</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Tipo Projeto</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Concessionária</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Regional</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Valor</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Data Execução</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Folha Medição</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Tec. Resp. Concessionária</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Status</TableHead>
                <TableHead className="sticky top-0 bg-white z-10 text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicoes.map((medicao) => (
                <TableRow key={`${medicao.idSistema}-${medicao.folha}-${new Date(medicao.dataExecucao).getTime()}`}>
                  <TableCell className="font-medium">{medicao.idSistema}</TableCell>
                  <TableCell>{medicao.tipoProjeto || 'N/A'}</TableCell>                  
                  <TableCell>
                  <ConcessionariaBadge concessionaria={medicao.cliente} />
                  </TableCell>
                  <TableCell>{medicao.regional || 'N/A'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(medicao.valorTotal)}
                  </TableCell>
                  <TableCell>
                    {new Date(medicao.dataExecucao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{medicao.folha}</TableCell>
                  <TableCell>{medicao.responsavel}</TableCell>
                  <TableCell>
                    <StatusBadge status={medicao.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {medicao.status === 'pendente_envio' && (
                        <Button
                          size="sm"
                          className="flex justify-center bg-blue-600 hover:bg-blue-700 text-white w-9"
                          onClick={() => {
                            console.log(`Nova Medição para ${medicao.idSistema}`)
                          }}
                          title="Nova Medição"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="hidden md:flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(medicao)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(medicao)}
                          title="Editar"
                          disabled={medicao.status === 'aprovado'}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(medicao)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {medicao.status === 'pendente_envio' && (
                              <DropdownMenuItem onClick={() => console.log(`Nova Medição para ${medicao.idSistema}`)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nova Medição
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleView(medicao)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEdit(medicao)}
                              disabled={medicao.status === 'aprovado'}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(medicao)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Modal de detalhes */}
      <Dialog
        open={action === 'view' && !!selectedMedicao}
        onOpenChange={(open) => {
          if (!open) setSelectedMedicao(null)
        }}
      >
        {/*<DialogContent className="sm:max-w-3xl">*/}
        <DialogContent className="sm:max-w-[50vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">Detalhes da Medição {selectedMedicao?.idSistema}</DialogTitle>
                <DialogDescription>
                  Informações completas sobre esta medição
                </DialogDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedMedicao(null)}
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedMedicao && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3">Informações Básicas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Concessionária:</span>
                        <span className="font-medium">
                          <ConcessionariaBadge concessionaria={selectedMedicao.cliente} />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contrato:</span>
                        <span className="font-medium">{selectedMedicao.contrato || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Local:</span>
                        <span className="font-medium">{selectedMedicao.local}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PI:</span>
                        <span className="font-medium">{selectedMedicao.pi || ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Circuito:</span>
                        <span className="font-medium">{selectedMedicao.circuito || ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zona:</span>
                        <span className="font-medium">{selectedMedicao.zona || ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responsável:</span>
                        <span className="font-medium">{selectedMedicao.responsavel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3">Valores</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor Total:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(selectedMedicao.valorTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">
                          <StatusBadge status={selectedMedicao.status} />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prioridade:</span>
                        <span className="font-medium capitalize">
                          {selectedMedicao.prioridade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3">Datas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Execução:</span>
                        <span className="font-medium">
                          {new Date(selectedMedicao.dataExecucao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Envio:</span>
                        <span className="font-medium">
                          {selectedMedicao.dataEnvio 
                            ? new Date(selectedMedicao.dataEnvio).toLocaleDateString('pt-BR') 
                            : 'Não enviado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resposta:</span>
                        <span className="font-medium">
                          {selectedMedicao.dataResposta
                            ? new Date(selectedMedicao.dataResposta).toLocaleDateString('pt-BR')
                            : 'Não respondido'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prazo Aprovação:</span>
                        <span className="font-medium">
                          {selectedMedicao.prazoAprovacao
                            ? new Date(selectedMedicao.prazoAprovacao).toLocaleDateString('pt-BR')
                            : 'Não definido'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Atividades</h3>
          <div className="border rounded-lg overflow-x-auto">
            <Table className="text-xs">
            {/*<Table className="text-[0.75rem]">  {/* Equivalente ao text-xs */}
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo Serviço</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Dispendio</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Observação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMedicao.atividades.map((atividade, index) => (
                        <TableRow key={index}>
                          <TableCell>{atividade.tipoServico}</TableCell>
                          <TableCell>{atividade.codigo}</TableCell>
                          <TableCell>{atividade.descricao}</TableCell>
                          <TableCell>{atividade.dispendio}</TableCell>
                          <TableCell>{atividade.unidade}</TableCell>
                          <TableCell className="text-left">{atividade.quantidade}</TableCell>
                          <TableCell className="text-left">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(atividade.precoUnitario)}
                          </TableCell>
                          <TableCell className="text-left">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(atividade.quantidade * atividade.precoUnitario)}
                          </TableCell>
                          <TableCell>{atividade.observacao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedMedicao.documentos && selectedMedicao.documentos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Documentos</h3>
                  <div className="space-y-2">
                    {selectedMedicao.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {doc.tipo} • {typeof doc.data === 'string' ? doc.data : new Date(doc.data).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(selectedMedicao)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="sm:justify-start">
                <Button 
                  onClick={() => {
                    handleEdit(selectedMedicao)
                    setAction('edit')
                  }}
                  disabled={selectedMedicao.status === 'aprovado'}
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Editar Medição
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog
        open={action === 'edit' && !!selectedMedicao}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMedicao(null)
            setAction(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">Editar Medição {selectedMedicao?.idSistema}</DialogTitle>
                <DialogDescription>
                  Atualize os detalhes desta medição
                </DialogDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedMedicao(null)
                  setAction(null)
                }}
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedMedicao && editForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    name="local"
                    value={editForm.local || ''}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    name="responsavel"
                    value={editForm.responsavel || ''}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={editForm.observacoes || ''}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataExecucao">Data de Execução</Label>
                  <Input
                    id="dataExecucao"
                    name="dataExecucao"
                    type="date"
                    value={editForm.dataExecucao ? new Date(editForm.dataExecucao).toISOString().split('T')[0] : ''}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={editForm.status || ''}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pendente_envio">Pendente de Envio</option>
                    <option value="aguardando_aprovacao">Aguardando Aprovação</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                    <option value="correcao">Correção</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={editForm.prioridade || ''}
                    onChange={handleFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <h3 className="font-semibold text-lg mt-6">Atividades</h3>
              <div className="border rounded-lg overflow-x-auto text-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo Serviço</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Dispendio</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Valor Unitário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editForm.atividades?.map((atividade, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={atividade.tipoServico || ''}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].tipoServico = e.target.value
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={atividade.codigo}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].codigo = e.target.value
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={atividade.descricao}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].descricao = e.target.value
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={atividade.dispendio || ''}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].dispendio = e.target.value
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={atividade.unidade}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].unidade = e.target.value
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={atividade.quantidade}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].quantidade = Number(e.target.value)
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={atividade.precoUnitario}
                            onChange={(e) => {
                              const newAtividades = [...(editForm.atividades ?? [])]
                              newAtividades[index].precoUnitario = Number(e.target.value)
                              setEditForm({ ...editForm, atividades: newAtividades })
                            }}
                            className="text-right"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMedicao(null)
                    setAction(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
