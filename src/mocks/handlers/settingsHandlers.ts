import { rest } from 'msw';
import { db } from '../db';

export const settingsHandlers = [
  // Obter configurações da empresa
  rest.get('/api/settings', (req, res, ctx) => {
    const settings = db.settings.findFirst({
      where: { id: { equals: 'company-settings' } },
    });
    
    if (!settings) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Configurações não encontradas' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(settings)
    );
  }),
  
  // Atualizar configurações da empresa
  rest.put('/api/settings', async (req, res, ctx) => {
    const data = await req.json();
    
    const existingSettings = db.settings.findFirst({
      where: { id: { equals: 'company-settings' } },
    });
    
    if (!existingSettings) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Configurações não encontradas' })
      );
    }
    
    const updatedSettings = db.settings.update({
      where: { id: { equals: 'company-settings' } },
      data,
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedSettings)
    );
  }),
  
  // Listar usuários do sistema
  rest.get('/api/users', (req, res, ctx) => {
    const users = db.user.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(users)
    );
  }),
  
  // Obter detalhes de um usuário específico
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const user = db.user.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Usuário não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(user)
    );
  }),
  
  // Criar novo usuário
  rest.post('/api/users', async (req, res, ctx) => {
    const data = await req.json();
    
    const newUser = db.user.create({
      ...data,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newUser)
    );
  }),
  
  // Atualizar usuário existente
  rest.put('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingUser = db.user.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingUser) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Usuário não encontrado' })
      );
    }
    
    const updatedUser = db.user.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedUser)
    );
  }),
  
  // Remover usuário
  rest.delete('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingUser = db.user.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingUser) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Usuário não encontrado' })
      );
    }
    
    db.user.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Usuário removido com sucesso' })
    );
  }),
];
