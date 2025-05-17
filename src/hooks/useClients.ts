import { useState, useEffect } from 'react';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Falha ao carregar clientes');
        }
        const data = await response.json();
        setClients(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const getClient = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clients/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do cliente');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Falha ao criar cliente');
      }
      const newClient = await response.json();
      setClients([...clients, newClient]);
      return newClient;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar cliente');
      }
      const updatedClient = await response.json();
      setClients(clients.map(client => client.id === id ? updatedClient : client));
      return updatedClient;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover cliente');
      }
      setClients(clients.filter(client => client.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    getClient,
    createClient,
    updateClient,
    deleteClient,
  };
}

export default useClients;
