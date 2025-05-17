import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatCard from '../../components/data-display/StatCard';
import Table from '../../components/data-display/Table';
import useDashboard from '../../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refreshData } = useDashboard();

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-500 mb-4">Não foi possível carregar os dados do dashboard.</p>
            <Button onClick={refreshData}>Tentar novamente</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="primary" onClick={refreshData}>Atualizar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Vendas Totais" 
          value={`R$ ${data.stats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend={5} 
          trendDirection="good"
        />
        <StatCard 
          title="Pedidos Pendentes" 
          value={data.stats.pendingOrders} 
          trend={-2} 
          trendDirection="bad"
        />
        <StatCard 
          title="Orçamentos Ativos" 
          value={data.stats.activeQuotes} 
          trend={3} 
          trendDirection="good"
        />
        <StatCard 
          title="Itens com Estoque Baixo" 
          value={data.stats.lowStockItems} 
          trend={1} 
          trendDirection="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pedidos Recentes">
          <Table
            columns={[
              { header: 'Número', accessor: 'number' },
              { header: 'Cliente', accessor: 'client' },
              { header: 'Data', accessor: 'date' },
              { header: 'Valor', accessor: 'total' },
              { header: 'Status', accessor: 'status' },
              { header: 'Ações', accessor: 'actions' }
            ]}
            data={data.recentOrders.map(order => ({
              number: order.number,
              client: order.client.name,
              date: new Date(order.date).toLocaleDateString('pt-BR'),
              total: `R$ ${order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              status: getStatusBadge(order.status),
              actions: (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  Ver
                </Button>
              )
            }))}
          />
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => navigate('/orders')}>
              Ver Todos os Pedidos
            </Button>
          </div>
        </Card>

        <Card title="Próximas Entregas">
          <Table
            columns={[
              { header: 'Número', accessor: 'number' },
              { header: 'Cliente', accessor: 'client' },
              { header: 'Entrega', accessor: 'deliveryDate' },
              { header: 'Status', accessor: 'status' },
              { header: 'Ações', accessor: 'actions' }
            ]}
            data={data.upcomingDeliveries.map(delivery => ({
              number: delivery.number,
              client: delivery.client.name,
              deliveryDate: new Date(delivery.deliveryDate).toLocaleDateString('pt-BR'),
              status: getStatusBadge(delivery.status),
              actions: (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/orders/${delivery.id}`)}
                >
                  Ver
                </Button>
              )
            }))}
          />
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => navigate('/production')}>
              Ver Produção
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>;
    case 'in_production':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Em Produção</span>;
    case 'ready':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pronto</span>;
    case 'delivered':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Entregue</span>;
    case 'canceled':
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelado</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  }
};

export default Dashboard;
