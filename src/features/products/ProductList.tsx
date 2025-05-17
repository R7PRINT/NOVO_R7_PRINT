import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  status: string;
  price: number;
  unit: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="success">Ativo</Badge>;
    } else {
      return <Badge variant="danger">Inativo</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link to="/products/new">
          <Button variant="primary">Novo Produto</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <Table
          columns={[
            { header: 'Código', accessor: 'code' },
            { header: 'Nome', accessor: 'name' },
            { header: 'Categoria', accessor: 'category' },
            { header: 'Preço', accessor: 'price' },
            { header: 'Unidade', accessor: 'unit' },
            { header: 'Status', accessor: 'status' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={products.map(product => ({
            code: product.code,
            name: product.name,
            category: product.category,
            price: `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            unit: product.unit,
            status: getStatusBadge(product.status),
            actions: (
              <div className="flex space-x-2">
                <Link to={`/products/${product.id}`}>
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

export default ProductList;
