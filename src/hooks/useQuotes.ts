import { useState, useEffect } from 'react';

export function useQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quotes');
        if (!response.ok) {
          throw new Error('Falha ao carregar orçamentos');
        }
        const data = await response.json();
        setQuotes(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const getQuote = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${id}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do orçamento');
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

  const createQuote = async (quoteData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      if (!response.ok) {
        throw new Error('Falha ao criar orçamento');
      }
      const newQuote = await response.json();
      setQuotes([...quotes, newQuote]);
      return newQuote;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (id, quoteData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar orçamento');
      }
      const updatedQuote = await response.json();
      setQuotes(quotes.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao remover orçamento');
      }
      setQuotes(quotes.filter(quote => quote.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar status do orçamento');
      }
      const updatedQuote = await response.json();
      setQuotes(quotes.map(quote => quote.id === id ? updatedQuote : quote));
      return updatedQuote;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const convertToOrder = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${id}/convert`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Falha ao converter orçamento em pedido');
      }
      const result = await response.json();
      // Atualizar o orçamento na lista local
      const updatedQuote = { ...quotes.find(q => q.id === id), status: 'approved' };
      setQuotes(quotes.map(quote => quote.id === id ? updatedQuote : quote));
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    quotes,
    loading,
    error,
    getQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    updateQuoteStatus,
    convertToOrder,
  };
}

export default useQuotes;
