import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatCard from '../../components/data-display/StatCard';
import Table from '../../components/data-display/Table';

interface FinanceOverview {
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    pendingIncome: number;
    pendingExpense: number;
  };
  recentTransactions: any[];
}

const FinanceOverview: React.FC = () => {
  const [data, setData] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await fetch('/api/finance/overview');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados financeiros');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!data) {
    return <div>Erro ao carregar dados financeiros</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <div className="flex space-x-2">
          <Link to="/finance/transactions">
            <Button variant="secondary">Ver Transações</Button>
          </Link>
          <Button variant="primary">Nova Transação</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Receitas" 
          value={`R$ ${data.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend={+5} 
          icon="arrow-trend-up" 
        />
        <StatCard 
          title="Despesas" 
          value={`R$ ${data.summary.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend={-2} 
          icon="arrow-trend-down" 
          trendDirection="bad"
        />
        <StatCard 
          title="Saldo" 
          value={`R$ ${data.summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend={+3} 
          icon="wallet" 
          trendDirection={data.summary.balance >= 0 ? "good" : "bad"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="A Receber">
          <div className="text-2xl font-bold text-green-600 mb-2">
            R$ {data.summary.pendingIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500">
            Valores a receber nos próximos 30 dias
          </div>
        </Card>
        <Card title="A Pagar">
          <div className="text-2xl font-bold text-red-600 mb-2">
            R$ {data.summary.pendingExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500">
            Valores a pagar nos próximos 30 dias
          </div>
        </Card>
      </div>

      <Card title="Transações Recentes">
        <Table
          columns={[
            { header: 'Data', accessor: 'date' },
            { header: 'Descrição', accessor: 'description' },
            { header: 'Categoria', accessor: 'category' },
            { header: 'Tipo', accessor: 'type' },
            { header: 'Valor', accessor: 'value' },
            { header: 'Status', accessor: 'status' }
          ]}
          data={data.recentTransactions.map(transaction => ({
            date: new Date(transaction.date).toLocaleDateString('pt-BR'),
            description: transaction.description,
            category: transaction.category,
            type: transaction.type === 'income' ? 
              <span className="text-green-600">Receita</span> : 
              <span className="text-red-600">Despesa</span>,
            value: `R$ ${transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            status: transaction.status === 'paid' ? 
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pago</span> : 
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>
          }))}
        />
        <div className="mt-4 flex justify-center">
          <Link to="/finance/transactions">
            <Button variant="secondary">Ver Todas as Transações</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default FinanceOverview;
