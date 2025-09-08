import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4 bg-base-100" data-theme="light">
      <h1 className="text-2xl font-bold mb-4 text-primary">Dashboard de Teste</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-secondary">Card 1</h2>
            <p>Este é um card de exemplo.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Botão</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Card 2</h2>
            <p>Este é um card de exemplo.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Botão</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Card 3</h2>
            <p>Este é um card de exemplo.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Botão</button>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Card 4</h2>
            <p>Este é um card de exemplo.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Botão</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Alertas</h2>
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Seu dashboard foi criado com sucesso!</span>
        </div>
        <div role="alert" className="alert alert-warning mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Atenção: Este é um componente de teste.</span>
        </div>
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Erro: Falha ao carregar dados.</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;