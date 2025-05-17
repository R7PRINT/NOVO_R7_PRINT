import { rest } from 'msw';
import { db } from '../db';

export const productHandlers = [
  // Listar todos os produtos
  rest.get('/api/products', (req, res, ctx) => {
    const products = db.product.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(products)
    );
  }),
  
  // Obter detalhes de um produto específico
  rest.get('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const product = db.product.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Produto não encontrado' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(product)
    );
  }),
  
  // Criar novo produto
  rest.post('/api/products', async (req, res, ctx) => {
    const data = await req.json();
    
    const newProduct = db.product.create({
      ...data,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newProduct)
    );
  }),
  
  // Atualizar produto existente
  rest.put('/api/products/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingProduct = db.product.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingProduct) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Produto não encontrado' })
      );
    }
    
    const updatedProduct = db.product.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedProduct)
    );
  }),
  
  // Remover produto
  rest.delete('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingProduct = db.product.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingProduct) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Produto não encontrado' })
      );
    }
    
    db.product.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Produto removido com sucesso' })
    );
  }),
];
