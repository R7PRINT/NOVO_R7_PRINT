import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
  status: string;
  dueDate: string;
  relatedEntity?: {
    type: string;
    id: string;
  };
}

const FinanceTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    period: '30days'
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/finance/transactions');
        if (!response.ok) {
          throw new Error('Falha ao carregar transações');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pago</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="danger">Atrasado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Filtrar por tipo
    if (filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }
    
    // Filtrar por status
    if (filter.status !== 'all' && transaction.status !== filter.status) {
      return false;
    }
    
    // Filtrar por período
    if (filter.period !== 'all') {
      const today = new Date();
      const transactionDate = new Date(transaction.date);
      
      if (filter.period === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        if (transactionDate < thirtyDaysAgo) {
          return false;
        }
      } else if (filter.period === '90days') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        if (transactionDate < ninetyDaysAgo) {
          return false;
        }
      }
    }
    
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transações Financeiras</h1>
        <Button variant="primary">Nova Transação</Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">Todos</option>
              <option value="paid">Pagos</option>
              <option value="pending">Pendentes</option>
              <option value="overdue">Atrasados</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={filter.period}
              onChange={(e) => setFilter({ ...filter, period: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
            </select>
          </div>
        </div>

        <Table
          columns={[
            { header: 'Data', accessor: 'date' },
            { header: 'Descrição', accessor: 'description' },
            { header: 'Categoria', accessor: 'category' },
            { header: 'Tipo', accessor: 'type' },
            { header: 'Valor', accessor: 'value' },
            { header: 'Vencimento', accessor: 'dueDate' },
            { header: 'Status', accessor: 'status' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={filteredTransactions.map(transaction => ({
            date: new Date(transaction.date).toLocaleDateString('pt-BR'),
            description: transaction.description,
            category: transaction.category,
            type: transaction.type === 'income' ? 
              <span className="text-green-600">Receita</span> : 
              <span className="text-red-600">Despesa</span>,
            value: `R$ ${transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            dueDate: new Date(transaction.dueDate).toLocaleDateString('pt-BR'),
            status: getStatusBadge(transaction.status),
            actions: (
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">Editar</Button>
                {transaction.status === 'pending' && (
                  <Button variant="success" size="sm">Marcar como Pago</Button>
                )}
              </div>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default FinanceTransactions;
