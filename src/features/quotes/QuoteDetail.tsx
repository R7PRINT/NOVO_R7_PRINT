import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';
import Table from '../../components/data-display/Table';

interface QuoteItem {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
  };
  items: QuoteItem[];
  total: number;
  date: string;
  validUntil: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNewQuote = id === 'new';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar clientes
        const clientsResponse = await fetch('/api/clients');
        if (!clientsResponse.ok) {
          throw new Error('Falha ao carregar clientes');
        }
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

        // Carregar produtos
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Se for um novo orçamento, inicializar com valores padrão
        if (isNewQuote) {
          const today = new Date();
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          setQuote({
            id: '',
            number: `ORC-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
            client: { id: '', name: '' },
            items: [],
            total: 0,
            date: today.toISOString().split('T')[0],
            validUntil: nextMonth.toISOString().split('T')[0],
            status: 'valid'
          });
          setLoading(false);
          return;
        }

        // Carregar orçamento existente
        const quoteResponse = await fetch(`/api/quotes/${id}`);
        if (!quoteResponse.ok) {
          throw new Error('Falha ao carregar dados do orçamento');
        }
        const quoteData = await quoteResponse.json();
        setQuote(quoteData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewQuote]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(c => c.id === clientId);
    
    if (selectedClient && quote) {
      setQuote({
        ...quote,
        client: {
          id: selectedClient.id,
          name: selectedClient.name
        }
      });
    }
  };

  const handleAddItem = () => {
    if (!quote || products.length === 0) return;
    
    const firstProduct = products[0];
    const newItem: QuoteItem = {
      product: {
        id: firstProduct.id,
        name: firstProduct.name,
        price: firstProduct.price,
        unit: firstProduct.unit
      },
      quantity: 1,
      unitPrice: firstProduct.price,
      totalPrice: firstProduct.price
    };
    
    const updatedItems = [...quote.items, newItem];
    const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setQuote({
      ...quote,
      items: updatedItems,
      total
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!quote) return;
    
    const updatedItems = quote.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setQuote({
      ...quote,
      items: updatedItems,
      total
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!quote) return;
    
    const updatedItems = [...quote.items];
    const item = { ...updatedItems[index] };
    
    if (field === 'product') {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        item.product = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          unit: selectedProduct.unit
        };
        item.unitPrice = selectedProduct.price;
        item.totalPrice = item.quantity * selectedProduct.price;
      }
    } else if (field === 'quantity') {
      item.quantity = parseFloat(value) || 0;
      item.totalPrice = item.quantity * item.unitPrice;
    } else if (field === 'unitPrice') {
      item.unitPrice = parseFloat(value) || 0;
      item.totalPrice = item.quantity * item.unitPrice;
    }
    
    updatedItems[index] = item;
    const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setQuote({
      ...quote,
      items: updatedItems,
      total
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;

    try {
      setSaving(true);
      const url = isNewQuote ? '/api/quotes' : `/api/quotes/${id}`;
      const method = isNewQuote ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar orçamento');
      }

      navigate('/quotes');
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!quote && !isNewQuote) {
    return <div>Orçamento não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewQuote ? 'Novo Orçamento' : `Orçamento: ${quote?.number}`}
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/quotes')}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Card>
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Número"
              name="number"
              value={quote?.number || ''}
              onChange={(e) => setQuote(quote ? { ...quote, number: e.target.value } : null)}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={quote?.client.id || ''}
                onChange={handleClientChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Data"
              name="date"
              type="date"
              value={quote?.date ? quote.date.split('T')[0] : ''}
              onChange={(e) => setQuote(quote ? { ...quote, date: e.target.value } : null)}
              required
            />
            <Input
              label="Válido até"
              name="validUntil"
              type="date"
              value={quote?.validUntil ? quote.validUntil.split('T')[0] : ''}
              onChange={(e) => setQuote(quote ? { ...quote, validUntil: e.target.value } : null)}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={quote?.status || 'valid'}
                onChange={(e) => setQuote(quote ? { ...quote, status: e.target.value } : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="valid">Válido</option>
                <option value="expired">Expirado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Itens do Orçamento</h3>
              <Button variant="secondary" size="sm" onClick={handleAddItem}>
                Adicionar Item
              </Button>
            </div>

            <Table
              columns={[
                { header: 'Produto', accessor: 'product' },
                { header: 'Quantidade', accessor: 'quantity' },
                { header: 'Preço Unit.', accessor: 'unitPrice' },
                { header: 'Total', accessor: 'total' },
                { header: 'Ações', accessor: 'actions' }
              ]}
              data={quote?.items.map((item, index) => ({
                product: (
                  <select
                    value={item.product.id}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                ),
                quantity: (
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                ),
                unitPrice: (
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                ),
                total: `R$ ${item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                actions: (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remover
                  </Button>
                )
              })) || []}
            />
          </div>

          <div className="flex justify-end">
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="text-xl font-bold">
                Total: R$ {quote?.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default QuoteDetail;
