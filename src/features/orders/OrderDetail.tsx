import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';
import Table from '../../components/data-display/Table';

interface OrderItem {
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

interface Order {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNewOrder = id === 'new';

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

        // Se for um novo pedido, inicializar com valores padrão
        if (isNewOrder) {
          const today = new Date();
          
          setOrder({
            id: '',
            number: `PED-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
            client: { id: '', name: '' },
            items: [],
            total: 0,
            date: today.toISOString().split('T')[0],
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'pix'
          });
          setLoading(false);
          return;
        }

        // Carregar pedido existente
        const orderResponse = await fetch(`/api/orders/${id}`);
        if (!orderResponse.ok) {
          throw new Error('Falha ao carregar dados do pedido');
        }
        const orderData = await orderResponse.json();
        setOrder(orderData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewOrder]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(c => c.id === clientId);
    
    if (selectedClient && order) {
      setOrder({
        ...order,
        client: {
          id: selectedClient.id,
          name: selectedClient.name
        }
      });
    }
  };

  const handleAddItem = () => {
    if (!order || products.length === 0) return;
    
    const firstProduct = products[0];
    const newItem: OrderItem = {
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
    
    const updatedItems = [...order.items, newItem];
    const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setOrder({
      ...order,
      items: updatedItems,
      total
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!order) return;
    
    const updatedItems = order.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setOrder({
      ...order,
      items: updatedItems,
      total
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!order) return;
    
    const updatedItems = [...order.items];
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
    
    setOrder({
      ...order,
      items: updatedItems,
      total
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setSaving(true);
      const url = isNewOrder ? '/api/orders' : `/api/orders/${id}`;
      const method = isNewOrder ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar pedido');
      }

      navigate('/orders');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!order && !isNewOrder) {
    return <div>Pedido não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewOrder ? 'Novo Pedido' : `Pedido: ${order?.number}`}
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/orders')}>
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
              value={order?.number || ''}
              onChange={(e) => setOrder(order ? { ...order, number: e.target.value } : null)}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={order?.client.id || ''}
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
              value={order?.date ? order.date.split('T')[0] : ''}
              onChange={(e) => setOrder(order ? { ...order, date: e.target.value } : null)}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={order?.status || 'pending'}
                onChange={(e) => setOrder(order ? { ...order, status: e.target.value } : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pending">Pendente</option>
                <option value="in_production">Em Produção</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status de Pagamento
              </label>
              <select
                value={order?.paymentStatus || 'pending'}
                onChange={(e) => setOrder(order ? { ...order, paymentStatus: e.target.value } : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pending">Pendente</option>
                <option value="partial">Parcial</option>
                <option value="paid">Pago</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pagamento
              </label>
              <select
                value={order?.paymentMethod || 'pix'}
                onChange={(e) => setOrder(order ? { ...order, paymentMethod: e.target.value } : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pix">PIX</option>
                <option value="transfer">Transferência</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="cash">Dinheiro</option>
                <option value="invoice">Boleto</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Itens do Pedido</h3>
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
              data={order?.items.map((item, index) => ({
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
                Total: R$ {order?.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OrderDetail;
