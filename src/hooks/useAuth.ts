import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Não autenticado');
        }
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setError('Sessão expirada ou usuário não autenticado');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setError(null);
      
      // Em um sistema real, armazenaria o token em localStorage ou cookies
      // localStorage.setItem('token', data.token);
      
      return true;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Em um sistema real, removeria o token do localStorage ou cookies
      // localStorage.removeItem('token');
      
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
}

export default useAuth;
