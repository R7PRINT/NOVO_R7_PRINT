import { setupWorker } from 'msw';
import { clientHandlers } from './handlers/clientHandlers';
import { productHandlers } from './handlers/productHandlers';
import { quoteHandlers } from './handlers/quoteHandlers';
import { orderHandlers } from './handlers/orderHandlers';
import { stockHandlers } from './handlers/stockHandlers';
import { financeHandlers } from './handlers/financeHandlers';
import { settingsHandlers } from './handlers/settingsHandlers';
import { authHandlers } from './handlers/authHandlers';
import { dashboardHandlers } from './handlers/dashboardHandlers';
import { initializeDb } from './db';

// Combinar todos os handlers
export const handlers = [
  ...clientHandlers,
  ...productHandlers,
  ...quoteHandlers,
  ...orderHandlers,
  ...stockHandlers,
  ...financeHandlers,
  ...settingsHandlers,
  ...authHandlers,
  ...dashboardHandlers,
];

// Inicializar o banco de dados com dados de exemplo
initializeDb();

// Configurar o service worker
export const worker = setupWorker(...handlers);

// Iniciar o service worker
export function startMockServiceWorker() {
  if (process.env.NODE_ENV === 'development') {
    worker.start({
      onUnhandledRequest: 'bypass',
    });
    
    console.log('🔶 Mock Service Worker inicializado');
  }
}
