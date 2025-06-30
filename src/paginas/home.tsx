import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5 pt-5">
      <h1 className="mb-3 fw-bold display-5">🐾 Bem-vindo ao PetLovers!</h1>
      <p className="lead mb-5">
        Gerencie clientes, pets, produtos e serviços com facilidade. Acompanhe registros de consumo e visualize estatísticas avançadas!
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate('/clientes')}>
          👥 Clientes
        </button>
        <button className="btn btn-success" onClick={() => navigate('/pets')}>
          🐶 Pets
        </button>
        <button className="btn btn-info" onClick={() => navigate('/produtos')}>
          📦 Produtos
        </button>
        <button className="btn btn-warning" onClick={() => navigate('/servicos')}>
          🛠️ Serviços
        </button>
        <button className="btn btn-dark" onClick={() => navigate('/relatorios')}>
          📊 Relatórios
        </button>
      </div>
    </div>
  );
}

