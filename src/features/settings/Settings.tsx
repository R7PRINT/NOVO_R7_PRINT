import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Form from '../../components/forms/Form';
import Alert from '../../components/feedback/Alert';

interface CompanySettings {
  name: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Falha ao carregar configurações');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar configurações');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!settings) {
    return <div>Erro ao carregar configurações</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {saveSuccess && (
        <Alert variant="success">
          Configurações salvas com sucesso!
        </Alert>
      )}

      <Card>
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome da Empresa"
              name="name"
              value={settings.name}
              onChange={handleChange}
              required
            />
            <Input
              label="CNPJ"
              name="document"
              value={settings.document}
              onChange={handleChange}
              required
            />
            <Input
              label="Endereço"
              name="address"
              value={settings.address}
              onChange={handleChange}
            />
            <Input
              label="Cidade"
              name="city"
              value={settings.city}
              onChange={handleChange}
            />
            <Input
              label="Estado"
              name="state"
              value={settings.state}
              onChange={handleChange}
            />
            <Input
              label="CEP"
              name="zipCode"
              value={settings.zipCode}
              onChange={handleChange}
            />
            <Input
              label="Telefone"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
            />
            <Input
              label="Website"
              name="website"
              value={settings.website}
              onChange={handleChange}
            />
            <Input
              label="URL do Logo"
              name="logo"
              value={settings.logo}
              onChange={handleChange}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={settings.description}
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

export default Settings;
