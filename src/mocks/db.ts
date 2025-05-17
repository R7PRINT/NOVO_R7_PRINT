import { factory, primaryKey } from '@mswjs/data';

// Definição do banco de dados em memória
export const db = factory({
  // Clientes
  client: {
    id: primaryKey(String),
    name: String,
    email: String,
    phone: String,
    document: String,
    status: String,
    company: String,
    address: String,
    notes: String,
    createdAt: String,
    updatedAt: String,
  },
  
  // Produtos
  product: {
    id: primaryKey(String),
    name: String,
    code: String,
    category: String,
    status: String,
    price: Number,
    unit: String,
    dimensions: String,
    materials: String,
    description: String,
    image: String,
    createdAt: String,
    updatedAt: String,
  },
  
  // Orçamentos
  quote: {
    id: primaryKey(String),
    number: String,
    client: Object,
    items: Array,
    total: Number,
    date: String,
    validUntil: String,
    status: String,
    createdAt: String,
    updatedAt: String,
  },
  
  // Pedidos
  order: {
    id: primaryKey(String),
    number: String,
    client: Object,
    items: Array,
    total: Number,
    date: String,
    status: String,
    paymentStatus: String,
    paymentMethod: String,
    createdAt: String,
    updatedAt: String,
  },
  
  // Estoque
  stock: {
    id: primaryKey(String),
    name: String,
    code: String,
    category: String,
    unit: String,
    quantity: Number,
    minQuantity: Number,
    costPrice: Number,
    supplier: String,
    location: String,
    lastPurchaseDate: String,
    notes: String,
    createdAt: String,
    updatedAt: String,
  },
  
  // Transações financeiras
  transaction: {
    id: primaryKey(String),
    date: String,
    description: String,
    category: String,
    type: String,
    value: Number,
    status: String,
    dueDate: String,
    relatedEntity: Object,
    createdAt: String,
    updatedAt: String,
  },
  
  // Configurações da empresa
  settings: {
    id: primaryKey(String),
    name: String,
    document: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
    email: String,
    website: String,
    logo: String,
    description: String,
  },
  
  // Usuários
  user: {
    id: primaryKey(String),
    name: String,
    email: String,
    role: String,
    status: String,
    lastLogin: String,
    createdAt: String,
    updatedAt: String,
  },
});

// Função para inicializar o banco de dados com dados de exemplo
export function initializeDb() {
  // Limpar banco de dados
  db.client.clear();
  db.product.clear();
  db.quote.clear();
  db.order.clear();
  db.stock.clear();
  db.transaction.clear();
  db.settings.clear();
  db.user.clear();
  
  // Adicionar dados de exemplo
  seedData();
}

// Função para popular o banco de dados com dados iniciais
function seedData() {
  // Configurações da empresa
  db.settings.create({
    id: 'company-settings',
    name: 'R7 Print',
    document: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    phone: '(11) 3456-7890',
    email: 'contato@r7print.com.br',
    website: 'www.r7print.com.br',
    logo: '/logo.svg',
    description: 'Soluções completas em comunicação visual',
  });
  
  // Usuários
  db.user.create({
    id: 'user-1',
    name: 'Administrador',
    email: 'admin@r7print.com.br',
    role: 'admin',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  // Clientes
  const clients = [
    {
      id: 'client-1',
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com.br',
      phone: '(11) 98765-4321',
      document: '12.345.678/0001-90',
      status: 'active',
      company: 'Empresa ABC',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      notes: 'Cliente desde 2020',
      createdAt: '2020-01-15T10:30:00Z',
      updatedAt: '2023-05-20T14:45:00Z',
    },
    {
      id: 'client-2',
      name: 'Comércio XYZ',
      email: 'contato@comercioxyz.com.br',
      phone: '(11) 91234-5678',
      document: '98.765.432/0001-10',
      status: 'active',
      company: 'Comércio XYZ',
      address: 'Av. Paulista, 1500 - São Paulo/SP',
      notes: 'Prefere entregas às quartas-feiras',
      createdAt: '2021-03-10T09:15:00Z',
      updatedAt: '2023-06-05T11:20:00Z',
    },
    {
      id: 'client-3',
      name: 'Restaurante Sabor & Arte',
      email: 'contato@saborarte.com.br',
      phone: '(11) 97777-8888',
      document: '45.678.901/0001-23',
      status: 'inactive',
      company: 'Sabor & Arte',
      address: 'Rua Augusta, 500 - São Paulo/SP',
      notes: 'Inativo desde janeiro/2023',
      createdAt: '2019-11-05T16:40:00Z',
      updatedAt: '2023-01-10T10:30:00Z',
    },
  ];
  
  clients.forEach(client => db.client.create(client));
  
  // Produtos
  const products = [
    {
      id: 'product-1',
      name: 'Banner em Lona 440g',
      code: 'BNR-001',
      category: 'Impressão Digital',
      status: 'active',
      price: 45.90,
      unit: 'm²',
      dimensions: 'Variável',
      materials: 'Lona 440g, acabamento em ilhós',
      description: 'Banner em lona 440g com impressão digital de alta qualidade',
      image: '/images/products/banner.jpg',
      createdAt: '2020-02-10T08:30:00Z',
      updatedAt: '2023-04-15T11:20:00Z',
    },
    {
      id: 'product-2',
      name: 'Adesivo Vinil Recorte',
      code: 'ADV-002',
      category: 'Recorte',
      status: 'active',
      price: 65.00,
      unit: 'm²',
      dimensions: 'Variável',
      materials: 'Vinil adesivo colorido',
      description: 'Adesivo em vinil recortado eletronicamente, ideal para personalização',
      image: '/images/products/adesivo.jpg',
      createdAt: '2020-03-05T09:45:00Z',
      updatedAt: '2023-05-20T14:30:00Z',
    },
    {
      id: 'product-3',
      name: 'Placa em PVC 3mm',
      code: 'PVC-003',
      category: 'Comunicação Visual',
      status: 'active',
      price: 120.00,
      unit: 'm²',
      dimensions: 'Variável',
      materials: 'PVC expandido 3mm, impressão UV',
      description: 'Placa em PVC expandido 3mm com impressão UV direta',
      image: '/images/products/placa-pvc.jpg',
      createdAt: '2020-04-12T10:15:00Z',
      updatedAt: '2023-06-10T16:45:00Z',
    },
    {
      id: 'product-4',
      name: 'Cartão de Visita 4x4',
      code: 'CTV-004',
      category: 'Impressão Offset',
      status: 'active',
      price: 90.00,
      unit: 'cento',
      dimensions: '9x5cm',
      materials: 'Couché 300g, laminação fosca',
      description: 'Cartão de visita em couché 300g, impressão 4x4 cores com laminação fosca',
      image: '/images/products/cartao.jpg',
      createdAt: '2020-05-20T14:30:00Z',
      updatedAt: '2023-03-15T09:20:00Z',
    },
    {
      id: 'product-5',
      name: 'Fachada em ACM',
      code: 'ACM-005',
      category: 'Comunicação Visual',
      status: 'active',
      price: 450.00,
      unit: 'm²',
      dimensions: 'Variável',
      materials: 'ACM 3mm, estrutura metálica',
      description: 'Fachada em ACM 3mm com estrutura metálica e iluminação em LED',
      image: '/images/products/fachada.jpg',
      createdAt: '2020-06-15T11:45:00Z',
      updatedAt: '2023-02-10T15:30:00Z',
    },
  ];
  
  products.forEach(product => db.product.create(product));
  
  // Orçamentos
  const quotes = [
    {
      id: 'quote-1',
      number: 'ORC-2023-001',
      client: db.client.findFirst({ where: { id: { equals: 'client-1' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-1' } } }),
          quantity: 2,
          unitPrice: 45.90,
          totalPrice: 91.80
        },
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-3' } } }),
          quantity: 1,
          unitPrice: 120.00,
          totalPrice: 120.00
        }
      ],
      total: 211.80,
      date: '2023-05-10T10:30:00Z',
      validUntil: '2023-06-10T23:59:59Z',
      status: 'valid',
      createdAt: '2023-05-10T10:30:00Z',
      updatedAt: '2023-05-10T10:30:00Z',
    },
    {
      id: 'quote-2',
      number: 'ORC-2023-002',
      client: db.client.findFirst({ where: { id: { equals: 'client-2' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-5' } } }),
          quantity: 3.5,
          unitPrice: 450.00,
          totalPrice: 1575.00
        }
      ],
      total: 1575.00,
      date: '2023-05-15T14:45:00Z',
      validUntil: '2023-06-15T23:59:59Z',
      status: 'valid',
      createdAt: '2023-05-15T14:45:00Z',
      updatedAt: '2023-05-15T14:45:00Z',
    },
    {
      id: 'quote-3',
      number: 'ORC-2023-003',
      client: db.client.findFirst({ where: { id: { equals: 'client-1' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-4' } } }),
          quantity: 5,
          unitPrice: 90.00,
          totalPrice: 450.00
        }
      ],
      total: 450.00,
      date: '2023-04-20T09:15:00Z',
      validUntil: '2023-05-20T23:59:59Z',
      status: 'expired',
      createdAt: '2023-04-20T09:15:00Z',
      updatedAt: '2023-04-20T09:15:00Z',
    },
  ];
  
  quotes.forEach(quote => db.quote.create(quote));
  
  // Pedidos
  const orders = [
    {
      id: 'order-1',
      number: 'PED-2023-001',
      client: db.client.findFirst({ where: { id: { equals: 'client-1' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-1' } } }),
          quantity: 2,
          unitPrice: 45.90,
          totalPrice: 91.80
        },
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-3' } } }),
          quantity: 1,
          unitPrice: 120.00,
          totalPrice: 120.00
        }
      ],
      total: 211.80,
      date: '2023-05-12T11:30:00Z',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'pix',
      createdAt: '2023-05-12T11:30:00Z',
      updatedAt: '2023-05-18T15:45:00Z',
    },
    {
      id: 'order-2',
      number: 'PED-2023-002',
      client: db.client.findFirst({ where: { id: { equals: 'client-2' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-5' } } }),
          quantity: 3.5,
          unitPrice: 450.00,
          totalPrice: 1575.00
        }
      ],
      total: 1575.00,
      date: '2023-05-16T16:30:00Z',
      status: 'in_production',
      paymentStatus: 'partial',
      paymentMethod: 'transfer',
      createdAt: '2023-05-16T16:30:00Z',
      updatedAt: '2023-05-20T10:15:00Z',
    },
    {
      id: 'order-3',
      number: 'PED-2023-003',
      client: db.client.findFirst({ where: { id: { equals: 'client-2' } } }),
      items: [
        {
          product: db.product.findFirst({ where: { id: { equals: 'product-2' } } }),
          quantity: 1.5,
          unitPrice: 65.00,
          totalPrice: 97.50
        }
      ],
      total: 97.50,
      date: '2023-05-22T09:45:00Z',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'invoice',
      createdAt: '2023-05-22T09:45:00Z',
      updatedAt: '2023-05-22T09:45:00Z',
    },
  ];
  
  orders.forEach(order => db.order.create(order));
  
  // Estoque
  const stockItems = [
    {
      id: 'stock-1',
      name: 'Lona 440g',
      code: 'MP-001',
      category: 'Matéria-prima',
      unit: 'm²',
      quantity: 45.5,
      minQuantity: 20,
      costPrice: 25.00,
      supplier: 'Fornecedor A',
      location: 'Prateleira A1',
      lastPurchaseDate: '2023-04-10T00:00:00Z',
      notes: 'Lona para impressão digital',
      createdAt: '2020-01-10T08:30:00Z',
      updatedAt: '2023-04-10T14:20:00Z',
    },
    {
      id: 'stock-2',
      name: 'Vinil Adesivo',
      code: 'MP-002',
      category: 'Matéria-prima',
      unit: 'm²',
      quantity: 30.0,
      minQuantity: 15,
      costPrice: 35.00,
      supplier: 'Fornecedor B',
      location: 'Prateleira A2',
      lastPurchaseDate: '2023-05-05T00:00:00Z',
      notes: 'Vinil para recorte e impressão',
      createdAt: '2020-02-15T10:45:00Z',
      updatedAt: '2023-05-05T11:30:00Z',
    },
    {
      id: 'stock-3',
      name: 'PVC Expandido 3mm',
      code: 'MP-003',
      category: 'Matéria-prima',
      unit: 'placa',
      quantity: 12,
      minQuantity: 5,
      costPrice: 65.00,
      supplier: 'Fornecedor C',
      location: 'Prateleira B1',
      lastPurchaseDate: '2023-03-20T00:00:00Z',
      notes: 'Placas de 2,00 x 1,00m',
      createdAt: '2020-03-05T09:15:00Z',
      updatedAt: '2023-03-20T16:40:00Z',
    },
    {
      id: 'stock-4',
      name: 'Tinta UV',
      code: 'MP-004',
      category: 'Insumo',
      unit: 'litro',
      quantity: 3.5,
      minQuantity: 2,
      costPrice: 280.00,
      supplier: 'Fornecedor D',
      location: 'Armário C1',
      lastPurchaseDate: '2023-05-15T00:00:00Z',
      notes: 'Tinta para impressora UV',
      createdAt: '2020-04-10T11:30:00Z',
      updatedAt: '2023-05-15T10:20:00Z',
    },
    {
      id: 'stock-5',
      name: 'Ilhós Niquelado',
      code: 'MP-005',
      category: 'Acabamento',
      unit: 'cento',
      quantity: 8,
      minQuantity: 3,
      costPrice: 15.00,
      supplier: 'Fornecedor E',
      location: 'Gaveta D2',
      lastPurchaseDate: '2023-02-25T00:00:00Z',
      notes: 'Ilhós para acabamento de banners',
      createdAt: '2020-05-20T14:45:00Z',
      updatedAt: '2023-02-25T09:30:00Z',
    },
  ];
  
  stockItems.forEach(item => db.stock.create(item));
  
  // Transações financeiras
  const transactions = [
    {
      id: 'transaction-1',
      date: '2023-05-18T00:00:00Z',
      description: 'Pagamento do pedido PED-2023-001',
      category: 'Vendas',
      type: 'income',
      value: 211.80,
      status: 'paid',
      dueDate: '2023-05-18T00:00:00Z',
      relatedEntity: {
        type: 'order',
        id: 'order-1'
      },
      createdAt: '2023-05-18T15:45:00Z',
      updatedAt: '2023-05-18T15:45:00Z',
    },
    {
      id: 'transaction-2',
      date: '2023-05-16T00:00:00Z',
      description: 'Entrada do pedido PED-2023-002',
      category: 'Vendas',
      type: 'income',
      value: 787.50,
      status: 'paid',
      dueDate: '2023-05-16T00:00:00Z',
      relatedEntity: {
        type: 'order',
        id: 'order-2'
      },
      createdAt: '2023-05-16T16:30:00Z',
      updatedAt: '2023-05-16T16:30:00Z',
    },
    {
      id: 'transaction-3',
      date: '2023-06-16T00:00:00Z',
      description: 'Parcela final do pedido PED-2023-002',
      category: 'Vendas',
      type: 'income',
      value: 787.50,
      status: 'pending',
      dueDate: '2023-06-16T00:00:00Z',
      relatedEntity: {
        type: 'order',
        id: 'order-2'
      },
      createdAt: '2023-05-16T16:30:00Z',
      updatedAt: '2023-05-16T16:30:00Z',
    },
    {
      id: 'transaction-4',
      date: '2023-06-22T00:00:00Z',
      description: 'Pagamento do pedido PED-2023-003',
      category: 'Vendas',
      type: 'income',
      value: 97.50,
      status: 'pending',
      dueDate: '2023-06-22T00:00:00Z',
      relatedEntity: {
        type: 'order',
        id: 'order-3'
      },
      createdAt: '2023-05-22T09:45:00Z',
      updatedAt: '2023-05-22T09:45:00Z',
    },
    {
      id: 'transaction-5',
      date: '2023-05-05T00:00:00Z',
      description: 'Compra de matéria-prima - Vinil Adesivo',
      category: 'Fornecedores',
      type: 'expense',
      value: 1050.00,
      status: 'paid',
      dueDate: '2023-05-05T00:00:00Z',
      relatedEntity: {
        type: 'stock',
        id: 'stock-2'
      },
      createdAt: '2023-05-05T11:30:00Z',
      updatedAt: '2023-05-05T11:30:00Z',
    },
    {
      id: 'transaction-6',
      date: '2023-05-15T00:00:00Z',
      description: 'Compra de insumos - Tinta UV',
      category: 'Fornecedores',
      type: 'expense',
      value: 980.00,
      status: 'paid',
      dueDate: '2023-05-15T00:00:00Z',
      relatedEntity: {
        type: 'stock',
        id: 'stock-4'
      },
      createdAt: '2023-05-15T10:20:00Z',
      updatedAt: '2023-05-15T10:20:00Z',
    },
    {
      id: 'transaction-7',
      date: '2023-05-10T00:00:00Z',
      description: 'Pagamento de aluguel',
      category: 'Despesas Fixas',
      type: 'expense',
      value: 2500.00,
      status: 'paid',
      dueDate: '2023-05-10T00:00:00Z',
      relatedEntity: {
        type: 'other',
        id: null
      },
      createdAt: '2023-05-10T09:30:00Z',
      updatedAt: '2023-05-10T09:30:00Z',
    },
    {
      id: 'transaction-8',
      date: '2023-05-15T00:00:00Z',
      description: 'Pagamento de energia elétrica',
      category: 'Despesas Fixas',
      type: 'expense',
      value: 850.00,
      status: 'paid',
      dueDate: '2023-05-15T00:00:00Z',
      relatedEntity: {
        type: 'other',
        id: null
      },
      createdAt: '2023-05-15T14:20:00Z',
      updatedAt: '2023-05-15T14:20:00Z',
    },
    {
      id: 'transaction-9',
      date: '2023-06-10T00:00:00Z',
      description: 'Pagamento de aluguel',
      category: 'Despesas Fixas',
      type: 'expense',
      value: 2500.00,
      status: 'pending',
      dueDate: '2023-06-10T00:00:00Z',
      relatedEntity: {
        type: 'other',
        id: null
      },
      createdAt: '2023-05-25T10:15:00Z',
      updatedAt: '2023-05-25T10:15:00Z',
    },
  ];
  
  transactions.forEach(transaction => db.transaction.create(transaction));
}
