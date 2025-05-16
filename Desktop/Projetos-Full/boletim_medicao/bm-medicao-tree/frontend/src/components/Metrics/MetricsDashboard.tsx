import {
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileText,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Medicao } from '@/types/medicaoTypes';
import React from 'react';

interface MetricsDashboardProps {
  medicoes: Medicao[];
}

export default function MetricsDashboard({ medicoes }: MetricsDashboardProps) {
  const metrics = {
    total: medicoes.length,
    valorTotal: medicoes.reduce((sum, m) => sum + m.valorTotal, 0),
    aprovados: medicoes.filter((m) => m.status === 'aprovado').length,
    reprovados: medicoes.filter((m) => m.status === 'reprovado').length,
    pendentes: medicoes.filter((m) => m.status === 'pendente_envio').length,
    emAnalise: medicoes.filter((m) => m.status === 'aguardando_aprovacao').length,
    atrasadas: medicoes.filter(
      (m) => m.prazoAprovacao && new Date(m.prazoAprovacao) < new Date()
    ).length,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total de Medições"
        value={metrics.total}
        icon={<FileText />}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <span className="text-green-600 flex items-center text-xs mt-2">
          <TrendingUp className="h-3 w-3 mr-1" />
          + {metrics.total} cadastradas
        </span>
      </MetricCard>

      <MetricCard
        title="Valor Total"
        value={formatCurrency(metrics.valorTotal)}
        icon={<DollarSign />}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      >
        <span className="text-xs text-muted-foreground">
          Média por medição: {formatCurrency(metrics.valorTotal / (metrics.total || 1))}
        </span>
      </MetricCard>

      <MetricCard
        title="Aprovação"
        value={`${metrics.aprovados} / ${metrics.total}`}
        icon={<CheckCircle />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
      >
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${((metrics.aprovados / metrics.total) * 100 || 0).toFixed(1)}%` }}
          />
        </div>
      </MetricCard>

      <MetricCard
        title="Pendentes"
        value={metrics.pendentes}
        icon={<Clock />}
        iconBg="bg-yellow-50"
        iconColor="text-yellow-600"
      >
        <span className="text-xs text-muted-foreground">
          {metrics.emAnalise} em análise
        </span>
      </MetricCard>

      <MetricCard
        title="Em Análise"
        value={metrics.emAnalise}
        icon={<AlertCircle />}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />

      <MetricCard
        title="Reprovadas"
        value={metrics.reprovados}
        icon={<AlertCircle />}
        iconBg="bg-red-50"
        iconColor="text-red-600"
      />

      <MetricCard
        title="Atrasadas"
        value={metrics.atrasadas}
        icon={<Clock />}
        iconBg="bg-red-50"
        iconColor="text-red-600"
      />

      <MetricCard
        title="Taxa de Aprovação"
        value={`${(
          (metrics.aprovados / (metrics.aprovados + metrics.reprovados)) * 100 || 0
        ).toFixed(1)}%`}
        icon={<TrendingUp />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  children?: React.ReactNode;
}

function MetricCard({
  title,
  value,
  icon,
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-500',
  children,
}: MetricCardProps) {
  return (
    //<Card className="shadow-sm hover:shadow-md transition-shadow text-sm">
    //<Card className="bg-white border-b border-gray-100 shadow-md">
    <Card className="bg-white border-b border-gray-100 shadow-sm hover:shadow-lg transition-shadow">

    
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <CardDescription className="text-gray-500 text-xs">
              {title}
            </CardDescription>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {value}
            </CardTitle>
          </div>
          <div className={`p-2 rounded-lg ${iconBg}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: `h-5 w-5 ${iconColor}`,
            })}
          </div>
        </div>
      </CardHeader>
      {children && <CardContent className="pt-0 px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}
