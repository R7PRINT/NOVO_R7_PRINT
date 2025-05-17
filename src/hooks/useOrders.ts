import { useState, useEffect } from 'react';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Falha ao carregar pedidos');
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrder = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do pedido');
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

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Falha ao criar pedido');
      }
      const newOrder = await response.json();
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar pedido');
      }
      const updatedOrder = await response.json();
      setOrders(orders.map(order => order.id === id ? updatedOrder : order));
      return updatedOrder;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover pedido');
      }
      setOrders(orders.filter(order => order.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar status do pedido');
      }
      const updatedOrder = await response.json();
      setOrders(orders.map(order => order.id === id ? updatedOrder : order));
      return updatedOrder;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id, paymentStatus, paymentMethod) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus, paymentMethod }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar status de pagamento');
      }
      const updatedOrder = await response.json();
      setOrders(orders.map(order => order.id === id ? updatedOrder : order));
      return updatedOrder;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    updatePaymentStatus,
  };
}

export default useOrders;
