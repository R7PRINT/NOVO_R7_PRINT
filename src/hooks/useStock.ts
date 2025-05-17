import { useState, useEffect } from 'react';

export function useStock() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stock');
        if (!response.ok) {
          throw new Error('Falha ao carregar itens de estoque');
        }
        const data = await response.json();
        setStockItems(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setStockItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockItems();
  }, []);

  const getStockItem = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do item de estoque');
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

  const createStockItem = async (itemData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error('Falha ao criar item de estoque');
      }
      const newItem = await response.json();
      setStockItems([...stockItems, newItem]);
      return newItem;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStockItem = async (id, itemData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar item de estoque');
      }
      const updatedItem = await response.json();
      setStockItems(stockItems.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteStockItem = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover item de estoque');
      }
      setStockItems(stockItems.filter(item => item.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adjustStockQuantity = async (id, quantity, type, reason) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock/${id}/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, type, reason }),
      });
      if (!response.ok) {
        throw new Error('Falha ao ajustar quantidade em estoque');
      }
      const result = await response.json();
      setStockItems(stockItems.map(item => item.id === id ? result : item));
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLowStockItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stock/low');
      if (!response.ok) {
        throw new Error('Falha ao carregar itens com estoque baixo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    stockItems,
    loading,
    error,
    getStockItem,
    createStockItem,
    updateStockItem,
    deleteStockItem,
    adjustStockQuantity,
    getLowStockItems,
  };
}

export default useStock;
