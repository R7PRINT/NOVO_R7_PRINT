import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Página não encontrada</h2>
      <p className="text-gray-600 mt-2">A página que você está procurando não existe ou foi movida.</p>
      <a 
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Voltar para o início
      </a>
    </div>
  );
};

export default NotFound;
