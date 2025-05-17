import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';

interface StockItem {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  supplier: string;
  location: string;
}

const StockList: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await fetch('/api/stock');
        if (!response.ok) {
          throw new Error('Falha ao carregar itens de estoque');
        }
        const data = await response.json();
        setStockItems(data);
      } catch (error) {
        console.error('Erro ao buscar itens de estoque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockItems();
  }, []);

  const getStockStatusBadge = (quantity: number, minQuantity: number) => {
    if (quantity <= 0) {
      return <Badge variant="danger">Esgotado</Badge>;
    } else if (quantity <= minQuantity) {
      return <Badge variant="warning">Baixo</Badge>;
    } else {
      return <Badge variant="success">Normal</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <Link to="/stock/new">
          <Button variant="primary">Novo Item</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar itens de estoque..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <Table
          columns={[
            { header: 'Código', accessor: 'code' },
            { header: 'Nome', accessor: 'name' },
            { header: 'Categoria', accessor: 'category' },
            { header: 'Quantidade', accessor: 'quantity' },
            { header: 'Unidade', accessor: 'unit' },
            { header: 'Status', accessor: 'status' },
            { header: 'Localização', accessor: 'location' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={stockItems.map(item => ({
            code: item.code,
            name: item.name,
            category: item.category,
            quantity: `${item.quantity} ${item.unit}`,
            unit: item.unit,
            status: getStockStatusBadge(item.quantity, item.minQuantity),
            location: item.location,
            actions: (
              <div className="flex space-x-2">
                <Link to={`/stock/${item.id}`}>
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

export default StockList;
