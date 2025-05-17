import { rest } from 'msw';
import { db } from '../db';

export const dashboardHandlers = [
  // Endpoint para buscar dados do dashboard
  rest.get('/api/dashboard', (req, res, ctx) => {
    // Buscar pedidos recentes
    const recentOrders = db.order.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
    });

    // Buscar próximas entregas
    const today = new Date();
    const upcomingDeliveries = db.order.findMany({
      where: {
        status: {
          in: ['in_production', 'ready'],
        },
      },
      take: 5,
      orderBy: {
        date: 'asc',
      },
    }).map(order => ({
      ...order,
      deliveryDate: new Date(new Date(order.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    // Calcular estatísticas
    const allOrders = db.order.getAll();
    const allTransactions = db.transaction.getAll();
    const allStockItems = db.stock.getAll();

    const totalSales = allTransactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.value, 0);

    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const activeQuotes = db.quote.findMany({
      where: {
        status: 'valid',
      },
    }).length;
    const lowStockItems = allStockItems.filter(item => item.quantity <= item.minQuantity).length;

    return res(
      ctx.status(200),
      ctx.json({
        stats: {
          totalSales,
          pendingOrders,
          activeQuotes,
          lowStockItems,
        },
        recentOrders,
        upcomingDeliveries,
      })
    );
  }),
];
