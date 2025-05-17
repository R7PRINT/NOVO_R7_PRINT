import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './features/dashboard/Dashboard';
import ClientList from './features/clients/ClientList';
import ClientDetail from './features/clients/ClientDetail';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import QuoteList from './features/quotes/QuoteList';
import QuoteDetail from './features/quotes/QuoteDetail';
import OrderList from './features/orders/OrderList';
import OrderDetail from './features/orders/OrderDetail';
import StockList from './features/stock/StockList';
import StockDetail from './features/stock/StockDetail';
import FinanceOverview from './features/finance/FinanceOverview';
import FinanceTransactions from './features/finance/FinanceTransactions';
import Settings from './features/settings/Settings';
import Login from './features/auth/Login';
import NotFound from './features/common/NotFound';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="clients">
          <Route index element={<ClientList />} />
          <Route path="new" element={<ClientDetail />} />
          <Route path=":id" element={<ClientDetail />} />
        </Route>
        
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path="new" element={<ProductDetail />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
        
        <Route path="quotes">
          <Route index element={<QuoteList />} />
          <Route path="new" element={<QuoteDetail />} />
          <Route path=":id" element={<QuoteDetail />} />
        </Route>
        
        <Route path="orders">
          <Route index element={<OrderList />} />
          <Route path="new" element={<OrderDetail />} />
          <Route path=":id" element={<OrderDetail />} />
        </Route>
        
        <Route path="stock">
          <Route index element={<StockList />} />
          <Route path="new" element={<StockDetail />} />
          <Route path=":id" element={<StockDetail />} />
        </Route>
        
        <Route path="finance">
          <Route index element={<FinanceOverview />} />
          <Route path="transactions" element={<FinanceTransactions />} />
        </Route>
        
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
