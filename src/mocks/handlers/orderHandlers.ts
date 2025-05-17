import { rest } from 'msw';
import { db } from '../db';

export const orderHandlers = [
  // Listar todos os pedidos
  rest.get('/api/orders', (req, res, ctx) => {
    const orders = db.order.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(orders)
    );
  }),
  
  // Obter detalhes de um pedido específico
  rest.get('/api/orders/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const order = db.order.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!order) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Pedido não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(order)
    );
  }),
  
  // Criar novo pedido
  rest.post('/api/orders', async (req, res, ctx) => {
    const data = await req.json();
    
    const newOrder = db.order.create({
      ...data,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newOrder)
    );
  }),
  
  // Atualizar pedido existente
  rest.put('/api/orders/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingOrder = db.order.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingOrder) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Pedido não encontrado' })
      );
    }
    
    const updatedOrder = db.order.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedOrder)
    );
  }),
  
  // Remover pedido
  rest.delete('/api/orders/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingOrder = db.order.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingOrder) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Pedido não encontrado' })
      );
    }
    
    db.order.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Pedido removido com sucesso' })
    );
  }),
  
  // Atualizar status do pedido
  rest.put('/api/orders/:id/status', async (req, res, ctx) => {
    const { id } = req.params;
    const { status } = await req.json();
    
    const existingOrder = db.order.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingOrder) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Pedido não encontrado' })
      );
    }
    
    const updatedOrder = db.order.update({
      where: { id: { equals: id } },
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedOrder)
    );
  }),
  
  // Atualizar status de pagamento
  rest.put('/api/orders/:id/payment', async (req, res, ctx) => {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = await req.json();
    
    const existingOrder = db.order.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingOrder) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Pedido não encontrado' })
      );
    }
    
    const updatedOrder = db.order.update({
      where: { id: { equals: id } },
      data: {
        paymentStatus,
        paymentMethod: paymentMethod || existingOrder.paymentMethod,
        updatedAt: new Date().toISOString(),
      },
    });
    
    // Se o pagamento foi concluído, criar uma transação financeira
    if (paymentStatus === 'paid') {
      db.transaction.create({
        id: `transaction-${Date.now()}`,
        date: new Date().toISOString(),
        description: `Pagamento do pedido ${updatedOrder.number}`,
        category: 'Vendas',
        type: 'income',
        value: updatedOrder.total,
        status: 'paid',
        dueDate: new Date().toISOString(),
        relatedEntity: {
          type: 'order',
          id: updatedOrder.id
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    return res(
      ctx.status(200),
      ctx.json(updatedOrder)
    );
  }),
];
