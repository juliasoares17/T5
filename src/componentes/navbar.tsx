// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">🐾 PetLovers</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/pets">Pets</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/produtos">Produtos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/servicos">Serviços</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/relatorios">Relatórios</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

