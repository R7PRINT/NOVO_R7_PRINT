import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';

interface Order {
  id: string;
  number: string;
  client: {
    name: string;
  };
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Falha ao carregar pedidos');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      case 'in_production':
        return <Badge variant="info">Em Produção</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pago</Badge>;
      case 'partial':
        return <Badge variant="warning">Parcial</Badge>;
      case 'pending':
        return <Badge variant="danger">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Link to="/orders/new">
          <Button variant="primary">Novo Pedido</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar pedidos..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <Table
          columns={[
            { header: 'Número', accessor: 'number' },
            { header: 'Cliente', accessor: 'client' },
            { header: 'Data', accessor: 'date' },
            { header: 'Total', accessor: 'total' },
            { header: 'Status', accessor: 'status' },
            { header: 'Pagamento', accessor: 'paymentStatus' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={orders.map(order => ({
            number: order.number,
            client: order.client.name,
            date: new Date(order.date).toLocaleDateString('pt-BR'),
            total: `R$ ${order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            status: getStatusBadge(order.status),
            paymentStatus: getPaymentStatusBadge(order.paymentStatus),
            actions: (
              <div className="flex space-x-2">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="secondary" size="sm">Detalhes</Button>
                </Link>
              </div>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default OrderList;
