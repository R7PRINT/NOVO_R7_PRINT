import { rest } from 'msw';
import { db } from '../db';

export const authHandlers = [
  // Login de usuário
  rest.post('/api/auth/login', (req, res, ctx) => {
    // Simulação simples de autenticação
    // Em um sistema real, verificaríamos credenciais contra o banco de dados
    
    // Para fins de demonstração, aceitamos qualquer email/senha
    const { email, password } = req.body as { email: string; password: string };
    
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Email e senha são obrigatórios' })
      );
    }
    
    // Buscar usuário pelo email (para demonstração)
    const user = db.user.findFirst({
      where: { email: { equals: email } }
    }) || {
      id: 'demo-user',
      name: 'Usuário Demo',
      email: email,
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Atualizar último login
    if (user.id !== 'demo-user') {
      db.user.update({
        where: { id: { equals: user.id } },
        data: { lastLogin: new Date().toISOString() }
      });
    }
    
    // Retornar token simulado e informações do usuário
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake-jwt-token',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    );
  }),
  
  // Logout de usuário
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Logout realizado com sucesso' })
    );
  }),
  
  // Obter usuário atual
  rest.get('/api/auth/me', (req, res, ctx) => {
    // Em um sistema real, verificaríamos o token JWT
    // Para demonstração, retornamos um usuário fixo
    
    const user = db.user.findFirst() || {
      id: 'demo-user',
      name: 'Usuário Demo',
      email: 'admin@r7print.com.br',
      role: 'admin',
      status: 'active'
    };
    
    return res(
      ctx.status(200),
      ctx.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
    );
  })
];
