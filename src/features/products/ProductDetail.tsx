import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  status: string;
  price: number;
  unit: string;
  dimensions: string;
  materials: string;
  description: string;
  image: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNewProduct = id === 'new';

  useEffect(() => {
    if (isNewProduct) {
      setProduct({
        id: '',
        name: '',
        code: '',
        category: 'Impressão Digital',
        status: 'active',
        price: 0,
        unit: 'm²',
        dimensions: '',
        materials: '',
        description: '',
        image: ''
      });
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do produto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isNewProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => {
      if (!prev) return null;
      
      // Converter para número se for o campo de preço
      if (name === 'price') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setSaving(true);
      const url = isNewProduct ? '/api/products' : `/api/products/${id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar produto');
      }

      navigate('/products');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!product && !isNewProduct) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewProduct ? 'Novo Produto' : `Produto: ${product?.name}`}
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/products')}>
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
              value={product?.name || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Código"
              name="code"
              value={product?.code || ''}
              onChange={handleChange}
              required
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="category"
                value={product?.category || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Impressão Digital">Impressão Digital</option>
                <option value="Recorte">Recorte</option>
                <option value="Comunicação Visual">Comunicação Visual</option>
                <option value="Impressão Offset">Impressão Offset</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={product?.status || 'active'}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <Input
              label="Preço"
              name="price"
              type="number"
              step="0.01"
              value={product?.price || 0}
              onChange={handleChange}
              required
            />
            <Input
              label="Unidade"
              name="unit"
              value={product?.unit || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Dimensões"
              name="dimensions"
              value={product?.dimensions || ''}
              onChange={handleChange}
            />
            <Input
              label="Materiais"
              name="materials"
              value={product?.materials || ''}
              onChange={handleChange}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={product?.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <Input
              label="URL da Imagem"
              name="image"
              value={product?.image || ''}
              onChange={handleChange}
            />
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProductDetail;
