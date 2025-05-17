import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';

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
  lastPurchaseDate: string;
  notes: string;
}

const StockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockItem, setStockItem] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNewItem = id === 'new';

  useEffect(() => {
    if (isNewItem) {
      setStockItem({
        id: '',
        name: '',
        code: '',
        category: 'Matéria-prima',
        unit: 'm²',
        quantity: 0,
        minQuantity: 0,
        costPrice: 0,
        supplier: '',
        location: '',
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setLoading(false);
      return;
    }

    const fetchStockItem = async () => {
      try {
        const response = await fetch(`/api/stock/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do item de estoque');
        }
        const data = await response.json();
        setStockItem(data);
      } catch (error) {
        console.error('Erro ao buscar item de estoque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockItem();
  }, [id, isNewItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStockItem(prev => {
      if (!prev) return null;
      
      // Converter para número se for um campo numérico
      if (['quantity', 'minQuantity', 'costPrice'].includes(name)) {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItem) return;

    try {
      setSaving(true);
      const url = isNewItem ? '/api/stock' : `/api/stock/${id}`;
      const method = isNewItem ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockItem),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar item de estoque');
      }

      navigate('/stock');
    } catch (error) {
      console.error('Erro ao salvar item de estoque:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!stockItem && !isNewItem) {
    return <div>Item de estoque não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewItem ? 'Novo Item de Estoque' : `Item: ${stockItem?.name}`}
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/stock')}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Card>
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome"
              name="name"
              value={stockItem?.name || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Código"
              name="code"
              value={stockItem?.code || ''}
              onChange={handleChange}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="category"
                value={stockItem?.category || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Matéria-prima">Matéria-prima</option>
                <option value="Insumo">Insumo</option>
                <option value="Acabamento">Acabamento</option>
                <option value="Ferramenta">Ferramenta</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <Input
              label="Unidade"
              name="unit"
              value={stockItem?.unit || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Quantidade"
              name="quantity"
              type="number"
              step="0.01"
              value={stockItem?.quantity || 0}
              onChange={handleChange}
              required
            />
            <Input
              label="Quantidade Mínima"
              name="minQuantity"
              type="number"
              step="0.01"
              value={stockItem?.minQuantity || 0}
              onChange={handleChange}
              required
            />
            <Input
              label="Preço de Custo"
              name="costPrice"
              type="number"
              step="0.01"
              value={stockItem?.costPrice || 0}
              onChange={handleChange}
              required
            />
            <Input
              label="Fornecedor"
              name="supplier"
              value={stockItem?.supplier || ''}
              onChange={handleChange}
            />
            <Input
              label="Localização"
              name="location"
              value={stockItem?.location || ''}
              onChange={handleChange}
            />
            <Input
              label="Data da Última Compra"
              name="lastPurchaseDate"
              type="date"
              value={stockItem?.lastPurchaseDate ? stockItem.lastPurchaseDate.split('T')[0] : ''}
              onChange={handleChange}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="notes"
                value={stockItem?.notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StockDetail;
