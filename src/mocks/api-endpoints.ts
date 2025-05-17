// Mapeamento de endpoints necessários para o R7 Print Manager

// 1. Autenticação
// - POST /api/auth/login - Login de usuário
// - POST /api/auth/logout - Logout de usuário
// - GET /api/auth/me - Obter usuário atual

// 2. Dashboard
// - GET /api/dashboard - Obter dados do dashboard (estatísticas, pedidos recentes, próximas entregas)

// 3. Clientes
// - GET /api/clients - Listar todos os clientes
// - GET /api/clients/:id - Obter detalhes de um cliente específico
// - POST /api/clients - Criar novo cliente
// - PUT /api/clients/:id - Atualizar cliente existente
// - DELETE /api/clients/:id - Remover cliente

// 4. Produtos
// - GET /api/products - Listar todos os produtos
// - GET /api/products/:id - Obter detalhes de um produto específico
// - POST /api/products - Criar novo produto
// - PUT /api/products/:id - Atualizar produto existente
// - DELETE /api/products/:id - Remover produto

// 5. Orçamentos
// - GET /api/quotes - Listar todos os orçamentos
// - GET /api/quotes/:id - Obter detalhes de um orçamento específico
// - POST /api/quotes - Criar novo orçamento
// - PUT /api/quotes/:id - Atualizar orçamento existente
// - DELETE /api/quotes/:id - Remover orçamento
// - PUT /api/quotes/:id/status - Atualizar status do orçamento (válido, expirado, aprovado, rejeitado)
// - POST /api/quotes/:id/convert - Converter orçamento em pedido

// 6. Pedidos
// - GET /api/orders - Listar todos os pedidos
// - GET /api/orders/:id - Obter detalhes de um pedido específico
// - POST /api/orders - Criar novo pedido
// - PUT /api/orders/:id - Atualizar pedido existente
// - DELETE /api/orders/:id - Remover pedido
// - PUT /api/orders/:id/status - Atualizar status do pedido (pendente, em produção, concluído, cancelado)
// - PUT /api/orders/:id/payment - Atualizar status de pagamento (pendente, parcial, pago)

// 7. Estoque
// - GET /api/stock - Listar todos os itens de estoque
// - GET /api/stock/:id - Obter detalhes de um item específico
// - POST /api/stock - Criar novo item de estoque
// - PUT /api/stock/:id - Atualizar item existente
// - DELETE /api/stock/:id - Remover item
// - POST /api/stock/:id/adjust - Ajustar quantidade em estoque (entrada ou saída)
// - GET /api/stock/low - Listar itens com estoque baixo

// 8. Financeiro
// - GET /api/finance/overview - Obter visão geral financeira (receitas, despesas, saldo)
// - GET /api/finance/transactions - Listar todas as transações
// - GET /api/finance/transactions/:id - Obter detalhes de uma transação específica
// - POST /api/finance/transactions - Criar nova transação
// - PUT /api/finance/transactions/:id - Atualizar transação existente
// - DELETE /api/finance/transactions/:id - Remover transação
// - PUT /api/finance/transactions/:id/status - Atualizar status da transação (pendente, pago, atrasado)
// - GET /api/finance/reports/monthly - Relatório financeiro mensal
// - GET /api/finance/reports/category - Relatório por categoria

// 9. Configurações
// - GET /api/settings - Obter configurações da empresa
// - PUT /api/settings - Atualizar configurações da empresa
// - GET /api/users - Listar usuários do sistema
// - POST /api/users - Criar novo usuário
// - PUT /api/users/:id - Atualizar usuário existente
// - DELETE /api/users/:id - Remover usuário
