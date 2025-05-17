import { rest } from 'msw';
import { db } from '../db';

export const clientHandlers = [
  // Listar todos os clientes
  rest.get('/api/clients', (req, res, ctx) => {
    const clients = db.client.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(clients)
    );
  }),
  
  // Obter detalhes de um cliente específico
  rest.get('/api/clients/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const client = db.client.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!client) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Cliente não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(client)
    );
  }),
  
  // Criar novo cliente
  rest.post('/api/clients', async (req, res, ctx) => {
    const data = await req.json();
    
    const newClient = db.client.create({
      ...data,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newClient)
    );
  }),
  
  // Atualizar cliente existente
  rest.put('/api/clients/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingClient = db.client.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingClient) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Cliente não encontrado' })
      );
    }
    
    const updatedClient = db.client.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedClient)
    );
  }),
  
  // Remover cliente
  rest.delete('/api/clients/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingClient = db.client.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingClient) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Cliente não encontrado' })
      );
    }
    
    db.client.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Cliente removido com sucesso' })
    );
  }),
];
