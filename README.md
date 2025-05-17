# Documentação do R7 Print Manager

## Visão Geral

O R7 Print Manager é um sistema completo de gestão para empresas de comunicação visual e gráfica rápida. Desenvolvido com tecnologias modernas (React, TypeScript e Tailwind CSS), o sistema oferece uma interface intuitiva e responsiva para gerenciar todos os aspectos do negócio.

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Gerenciamento de Estado**: React Query, Context API
- **Roteamento**: React Router 6
- **Simulação de API**: MSW (Mock Service Worker)
- **Banco de Dados**: Simulado em memória
- **Build e Desenvolvimento**: Vite

## Estrutura do Projeto

```
r7-print-clone/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── common/      # Botões, inputs, cards, etc.
│   │   ├── data-display/ # Tabelas, gráficos, etc.
│   │   ├── feedback/    # Alertas, modais, etc.
│   │   ├── forms/       # Componentes de formulário
│   │   ├── layout/      # Layout principal, sidebar, header
│   │   └── navigation/  # Tabs, breadcrumbs, etc.
│   ├── features/        # Módulos do sistema
│   │   ├── auth/        # Autenticação
│   │   ├── clients/     # Gestão de clientes
│   │   ├── common/      # Páginas comuns (404, etc.)
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── finance/     # Gestão financeira
│   │   ├── orders/      # Gestão de pedidos
│   │   ├── products/    # Gestão de produtos
│   │   ├── quotes/      # Gestão de orçamentos
│   │   ├── settings/    # Configurações
│   │   └── stock/       # Gestão de estoque
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Utilitários e helpers
│   ├── mocks/           # Simulação de backend
│   │   ├── handlers/    # Handlers de API
│   │   ├── browser.ts   # Configuração do MSW
│   │   └── db.ts        # Banco de dados em memória
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── package.json         # Dependências
├── tailwind.config.js   # Configuração do Tailwind
├── tsconfig.json        # Configuração do TypeScript
└── vite.config.ts       # Configuração do Vite
```

## Módulos do Sistema

### Dashboard

O dashboard apresenta uma visão geral do negócio, com estatísticas importantes como:
- Pedidos recentes
- Orçamentos válidos
- Receitas e despesas do mês
- Itens com estoque baixo
- Status dos pedidos
- Pagamentos pendentes

### Clientes

Módulo para gerenciamento completo de clientes:
- Listagem com filtros e busca
- Cadastro e edição de clientes
- Visualização de histórico de pedidos e orçamentos
- Gestão de status (ativo/inativo)

### Produtos

Gerenciamento do catálogo de produtos:
- Listagem com filtros por categoria e status
- Cadastro e edição de produtos
- Definição de preços e especificações
- Associação com materiais do estoque

### Orçamentos

Criação e gestão de orçamentos:
- Listagem com filtros por status e cliente
- Criação de orçamentos com múltiplos itens
- Cálculo automático de valores
- Conversão de orçamento em pedido
- Geração de PDF

### Pedidos

Controle completo de pedidos:
- Listagem com filtros por status e cliente
- Criação e edição de pedidos
- Atualização de status de produção
- Gestão de pagamentos
- Integração com estoque e financeiro

### Estoque

Gestão de matérias-primas e insumos:
- Listagem com filtros e alertas de estoque baixo
- Cadastro e edição de itens
- Registro de entradas e saídas
- Integração com pedidos
- Histórico de movimentações

### Financeiro

Controle financeiro completo:
- Visão geral com receitas, despesas e saldo
- Listagem de transações com filtros
- Registro de receitas e despesas
- Controle de pagamentos pendentes
- Relatórios financeiros

### Configurações

Configurações do sistema e usuários:
- Dados da empresa
- Gestão de usuários e permissões
- Personalização do sistema

## Como Executar o Projeto

### Requisitos

- Node.js 16+ instalado
- NPM ou Yarn

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/r7-print-clone.git
cd r7-print-clone
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o sistema em seu navegador:
```
http://localhost:3000
```

5. Para fazer login, use as credenciais:
```
Email: admin@r7print.com.br
Senha: qualquer senha (o sistema aceita qualquer senha em modo de demonstração)
```

## Customização

### Alterando Cores e Tema

O sistema utiliza Tailwind CSS para estilização. Para alterar as cores principais, edite o arquivo `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... outras tonalidades
          600: '#0284c7', // Cor principal
          // ... outras tonalidades
        },
        // Outras cores personalizadas
      },
    },
  },
  // Resto da configuração
};
```

### Adicionando Novos Módulos

Para adicionar um novo módulo ao sistema:

1. Crie uma nova pasta em `src/features/` para o módulo
2. Implemente os componentes necessários
3. Adicione as rotas em `src/App.tsx`
4. Crie os handlers de API em `src/mocks/handlers/`
5. Atualize o banco de dados em `src/mocks/db.ts`

## Considerações Finais

O R7 Print Manager foi desenvolvido para ser uma solução completa e personalizável para empresas de comunicação visual. O código foi estruturado de forma modular e escalável, permitindo fácil manutenção e extensão.

Para suporte ou dúvidas, entre em contato através do email: suporte@r7print.com.br
