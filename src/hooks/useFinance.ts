import { useState, useEffect } from 'react';

export function useFinance() {
  const [transactions, setTransactions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/overview');
      if (!response.ok) {
        throw new Error('Falha ao carregar visão geral financeira');
      }
      const data = await response.json();
      setOverview(data);
      setError(null);
      return data;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/transactions');
      if (!response.ok) {
        throw new Error('Falha ao carregar transações');
      }
      const data = await response.json();
      setTransactions(data);
      setError(null);
      return data;
    } catch (error) {
      setError(error.message);
      setTransactions([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getTransaction = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finance/transactions/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados da transação');
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

  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) {
        throw new Error('Falha ao criar transação');
      }
      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      return newTransaction;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finance/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar transação');
      }
      const updatedTransaction = await response.json();
      setTransactions(transactions.map(transaction => 
        transaction.id === id ? updatedTransaction : transaction
      ));
      return updatedTransaction;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finance/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover transação');
      }
      setTransactions(transactions.filter(transaction => transaction.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finance/transactions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar status da transação');
      }
      const updatedTransaction = await response.json();
      setTransactions(transactions.map(transaction => 
        transaction.id === id ? updatedTransaction : transaction
      ));
      return updatedTransaction;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyReport = async (year, month) => {
    try {
      setLoading(true);
      let url = '/api/finance/reports/monthly';
      if (year) {
        url += `?year=${year}`;
        if (month) {
          url += `&month=${month}`;
        }
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha ao carregar relatório mensal');
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

  const getCategoryReport = async (type) => {
    try {
      setLoading(true);
      let url = '/api/finance/reports/category';
      if (type) {
        url += `?type=${type}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha ao carregar relatório por categoria');
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
    transactions,
    overview,
    loading,
    error,
    fetchOverview,
    fetchTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateTransactionStatus,
    getMonthlyReport,
    getCategoryReport,
  };
}

export default useFinance;
