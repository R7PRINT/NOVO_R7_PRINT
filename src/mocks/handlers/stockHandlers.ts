import { rest } from 'msw';
import { db } from '../db';

export const stockHandlers = [
  // Listar todos os itens de estoque
  rest.get('/api/stock', (req, res, ctx) => {
    const stockItems = db.stock.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(stockItems)
    );
  }),
  
  // Obter detalhes de um item específico
  rest.get('/api/stock/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const stockItem = db.stock.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!stockItem) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Item de estoque não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(stockItem)
    );
  }),
  
  // Criar novo item de estoque
  rest.post('/api/stock', async (req, res, ctx) => {
    const data = await req.json();
    
    const newStockItem = db.stock.create({
      ...data,
      id: `stock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newStockItem)
    );
  }),
  
  // Atualizar item existente
  rest.put('/api/stock/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingStockItem = db.stock.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingStockItem) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Item de estoque não encontrado' })
      );
    }
    
    const updatedStockItem = db.stock.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedStockItem)
    );
  }),
  
  // Remover item
  rest.delete('/api/stock/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingStockItem = db.stock.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingStockItem) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Item de estoque não encontrado' })
      );
    }
    
    db.stock.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Item de estoque removido com sucesso' })
    );
  }),
  
  // Ajustar quantidade em estoque
  rest.post('/api/stock/:id/adjust', async (req, res, ctx) => {
    const { id } = req.params;
    const { quantity, type, reason } = await req.json();
    
    const existingStockItem = db.stock.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingStockItem) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Item de estoque não encontrado' })
      );
    }
    
    // Calcular nova quantidade
    let newQuantity = existingStockItem.quantity;
    if (type === 'add') {
      newQuantity += parseFloat(quantity);
    } else if (type === 'remove') {
      newQuantity -= parseFloat(quantity);
      if (newQuantity < 0) newQuantity = 0;
    } else {
      newQuantity = parseFloat(quantity);
    }
    
    const updatedStockItem = db.stock.update({
      where: { id: { equals: id } },
      data: {
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json({
        ...updatedStockItem,
        adjustment: {
          type,
          quantity: parseFloat(quantity),
          reason,
          date: new Date().toISOString(),
        },
      })
    );
  }),
  
  // Listar itens com estoque baixo
  rest.get('/api/stock/low', (req, res, ctx) => {
    const stockItems = db.stock.getAll();
    
    const lowStockItems = stockItems.filter(item => item.quantity <= item.minQuantity);
    
    return res(
      ctx.status(200),
      ctx.json(lowStockItems)
    );
  }),
];
