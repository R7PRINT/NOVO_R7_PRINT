import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/data-display/Table';
import Badge from '../../components/common/Badge';
import useClients from '../../hooks/useClients';

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const { clients, loading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState(clients);

  useEffect(() => {
    if (clients) {
      setFilteredClients(
        clients.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.document.includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [clients, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar clientes</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button variant="primary" onClick={() => navigate('/clients/new')}>
          Novo Cliente
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar por nome, documento ou email..."
            value={searchTerm}
            onChange={handleSearch}
            icon={
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        <Table
          columns={[
            { header: 'Nome', accessor: 'name' },
            { header: 'Documento', accessor: 'document' },
            { header: 'Email', accessor: 'email' },
            { header: 'Telefone', accessor: 'phone' },
            { header: 'Status', accessor: 'status' },
            { header: 'Ações', accessor: 'actions' }
          ]}
          data={filteredClients.map(client => ({
            name: client.name,
            document: client.document,
            email: client.email,
            phone: client.phone,
            status: client.status === 'active' ? 
              <Badge variant="success">Ativo</Badge> : 
              <Badge variant="danger">Inativo</Badge>,
            actions: (
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/clients/${client.id}/edit`)}
                >
                  Editar
                </Button>
              </div>
            )
          }))}
        />

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum cliente encontrado.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientList;
