import { useState, useEffect } from 'react';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do dashboard');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
      return dashboardData;
    } catch (error) {
      setError(error.message);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    return fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
}

export default useDashboard;
