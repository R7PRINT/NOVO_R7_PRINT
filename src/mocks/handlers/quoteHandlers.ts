import { rest } from 'msw';
import { db } from '../db';

export const quoteHandlers = [
  // Listar todos os orçamentos
  rest.get('/api/quotes', (req, res, ctx) => {
    const quotes = db.quote.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(quotes)
    );
  }),
  
  // Obter detalhes de um orçamento específico
  rest.get('/api/quotes/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const quote = db.quote.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!quote) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Orçamento não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(quote)
    );
  }),
  
  // Criar novo orçamento
  rest.post('/api/quotes', async (req, res, ctx) => {
    const data = await req.json();
    
    const newQuote = db.quote.create({
      ...data,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newQuote)
    );
  }),
  
  // Atualizar orçamento existente
  rest.put('/api/quotes/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingQuote = db.quote.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingQuote) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Orçamento não encontrado' })
      );
    }
    
    const updatedQuote = db.quote.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedQuote)
    );
  }),
  
  // Remover orçamento
  rest.delete('/api/quotes/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingQuote = db.quote.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingQuote) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Orçamento não encontrado' })
      );
    }
    
    db.quote.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Orçamento removido com sucesso' })
    );
  }),
  
  // Atualizar status do orçamento
  rest.put('/api/quotes/:id/status', async (req, res, ctx) => {
    const { id } = req.params;
    const { status } = await req.json();
    
    const existingQuote = db.quote.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingQuote) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Orçamento não encontrado' })
      );
    }
    
    const updatedQuote = db.quote.update({
      where: { id: { equals: id } },
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedQuote)
    );
  }),
  
  // Converter orçamento em pedido
  rest.post('/api/quotes/:id/convert', async (req, res, ctx) => {
    const { id } = req.params;
    
    const existingQuote = db.quote.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingQuote) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Orçamento não encontrado' })
      );
    }
    
    // Atualizar status do orçamento
    db.quote.update({
      where: { id: { equals: id } },
      data: {
        status: 'approved',
        updatedAt: new Date().toISOString(),
      },
    });
    
    // Criar novo pedido baseado no orçamento
    const today = new Date();
    const newOrder = db.order.create({
      id: `order-${Date.now()}`,
      number: `PED-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
      client: existingQuote.client,
      items: existingQuote.items,
      total: existingQuote.total,
      date: today.toISOString(),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'pix',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    });
    
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Orçamento convertido em pedido com sucesso',
        order: newOrder,
      })
    );
  }),
];
