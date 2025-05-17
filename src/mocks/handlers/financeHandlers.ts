import { rest } from 'msw';
import { db } from '../db';

export const financeHandlers = [
  // Obter visão geral financeira
  rest.get('/api/finance/overview', (req, res, ctx) => {
    const transactions = db.transaction.getAll();
    
    // Calcular estatísticas financeiras
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.value, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.value, 0);
      
    const balance = totalIncome - totalExpense;
    
    // Calcular valores pendentes
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const pendingIncome = transactions
      .filter(t => 
        t.type === 'income' && 
        t.status === 'pending' && 
        new Date(t.dueDate) <= thirtyDaysLater
      )
      .reduce((sum, t) => sum + t.value, 0);
      
    const pendingExpense = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.status === 'pending' && 
        new Date(t.dueDate) <= thirtyDaysLater
      )
      .reduce((sum, t) => sum + t.value, 0);
    
    // Obter transações recentes
    const recentTransactions = db.transaction.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          totalIncome,
          totalExpense,
          balance,
          pendingIncome,
          pendingExpense,
        },
        recentTransactions,
      })
    );
  }),
  
  // Listar todas as transações
  rest.get('/api/finance/transactions', (req, res, ctx) => {
    const transactions = db.transaction.getAll();
    
    return res(
      ctx.status(200),
      ctx.json(transactions)
    );
  }),
  
  // Obter detalhes de uma transação específica
  rest.get('/api/finance/transactions/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const transaction = db.transaction.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!transaction) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Transação não encontrada' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(transaction)
    );
  }),
  
  // Criar nova transação
  rest.post('/api/finance/transactions', async (req, res, ctx) => {
    const data = await req.json();
    
    const newTransaction = db.transaction.create({
      ...data,
      id: `transaction-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return res(
      ctx.status(201),
      ctx.json(newTransaction)
    );
  }),
  
  // Atualizar transação existente
  rest.put('/api/finance/transactions/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const data = await req.json();
    
    const existingTransaction = db.transaction.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingTransaction) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Transação não encontrada' })
      );
    }
    
    const updatedTransaction = db.transaction.update({
      where: { id: { equals: id } },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedTransaction)
    );
  }),
  
  // Remover transação
  rest.delete('/api/finance/transactions/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const existingTransaction = db.transaction.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingTransaction) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Transação não encontrada' })
      );
    }
    
    db.transaction.delete({
      where: { id: { equals: id } },
    });
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Transação removida com sucesso' })
    );
  }),
  
  // Atualizar status da transação
  rest.put('/api/finance/transactions/:id/status', async (req, res, ctx) => {
    const { id } = req.params;
    const { status } = await req.json();
    
    const existingTransaction = db.transaction.findFirst({
      where: { id: { equals: id } },
    });
    
    if (!existingTransaction) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Transação não encontrada' })
      );
    }
    
    const updatedTransaction = db.transaction.update({
      where: { id: { equals: id } },
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return res(
      ctx.status(200),
      ctx.json(updatedTransaction)
    );
  }),
  
  // Relatório financeiro mensal
  rest.get('/api/finance/reports/monthly', (req, res, ctx) => {
    const { year, month } = req.url.searchParams;
    
    const transactions = db.transaction.getAll();
    
    // Filtrar transações pelo ano e mês, se fornecidos
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (year && month) {
        return (
          transactionDate.getFullYear() === parseInt(year) &&
          transactionDate.getMonth() === parseInt(month) - 1
        );
      } else if (year) {
        return transactionDate.getFullYear() === parseInt(year);
      }
      
      return true;
    });
    
    // Agrupar por mês
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          income: 0,
          expense: 0,
          balance: 0,
        };
      }
      
      if (transaction.type === 'income' && transaction.status === 'paid') {
        acc[yearMonth].income += transaction.value;
      } else if (transaction.type === 'expense' && transaction.status === 'paid') {
        acc[yearMonth].expense += transaction.value;
      }
      
      acc[yearMonth].balance = acc[yearMonth].income - acc[yearMonth].expense;
      
      return acc;
    }, {});
    
    // Converter para array
    const report = Object.values(monthlyData);
    
    return res(
      ctx.status(200),
      ctx.json(report)
    );
  }),
  
  // Relatório por categoria
  rest.get('/api/finance/reports/category', (req, res, ctx) => {
    const { type } = req.url.searchParams;
    
    const transactions = db.transaction.getAll();
    
    // Filtrar por tipo, se fornecido
    const filteredTransactions = type
      ? transactions.filter(t => t.type === type && t.status === 'paid')
      : transactions.filter(t => t.status === 'paid');
    
    // Agrupar por categoria
    const categoryData = filteredTransactions.reduce((acc, transaction) => {
      const { category } = transaction;
      
      if (!acc[category]) {
        acc[category] = {
          category,
          total: 0,
          count: 0,
        };
      }
      
      acc[category].total += transaction.value;
      acc[category].count += 1;
      
      return acc;
    }, {});
    
    // Converter para array
    const report = Object.values(categoryData);
    
    return res(
      ctx.status(200),
      ctx.json(report)
    );
  }),
];
