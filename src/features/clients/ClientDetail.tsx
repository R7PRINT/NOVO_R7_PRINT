import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  status: string;
  company: string;
  address: string;
  notes: string;
}

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNewClient = id === 'new';

  useEffect(() => {
    if (isNewClient) {
      setClient({
        id: '',
        name: '',
        email: '',
        phone: '',
        document: '',
        status: 'active',
        company: '',
        address: '',
        notes: ''
      });
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do cliente');
        }
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, isNewClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClient(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    try {
      setSaving(true);
      const url = isNewClient ? '/api/clients' : `/api/clients/${id}`;
      const method = isNewClient ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar cliente');
      }

      navigate('/clients');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!client && !isNewClient) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewClient ? 'Novo Cliente' : `Cliente: ${client?.name}`}
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/clients')}>
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
              value={client?.name || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Empresa"
              name="company"
              value={client?.company || ''}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={client?.email || ''}
              onChange={handleChange}
            />
            <Input
              label="Telefone"
              name="phone"
              value={client?.phone || ''}
              onChange={handleChange}
            />
            <Input
              label="Documento (CNPJ/CPF)"
              name="document"
              value={client?.document || ''}
              onChange={handleChange}
            />
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={client?.status || 'active'}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="col-span-2">
              <Input
                label="Endereço"
                name="address"
                value={client?.address || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="notes"
                value={client?.notes || ''}
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

export default ClientDetail;
