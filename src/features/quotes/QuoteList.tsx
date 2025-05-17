import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';

interface Quote {
  id: string;
  number: string;
  client: {
    name: string;
  };
  total: number;
  date: string;
  validUntil: string;
  status: string;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        if (!response.ok) {
          throw new Error('Falha ao carregar orçamentos');
        }
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge variant="success">Válido</Badge>;
      case 'expired':
        return <Badge variant="danger">Expirado</Badge>;
      case 'approved':
        return <Badge variant="info">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="warning">Rejeitado</Badge>;
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
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Link to="/quotes/new">
          <Button variant="primary">Novo Orçamento</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar orçamentos..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <Table
          columns={[
            { header: 'Número', accessor: 'number' },
            { header: 'Cliente', accessor: 'client' },
            { header: 'Data', accessor: 'date' },
            { header: 'Validade', accessor: 'validUntil' },
            { header: 'Total', accessor: 'total' },
            { header: 'Status', accessor: 'status' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={quotes.map(quote => ({
            number: quote.number,
            client: quote.client.name,
            date: new Date(quote.date).toLocaleDateString('pt-BR'),
            validUntil: new Date(quote.validUntil).toLocaleDateString('pt-BR'),
            total: `R$ ${quote.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            status: getStatusBadge(quote.status),
            actions: (
              <div className="flex space-x-2">
                <Link to={`/quotes/${quote.id}`}>
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

export default QuoteList;
