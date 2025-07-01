// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes/navbar'
import Home from './paginas/home';
import Clientes from './paginas/clientes';
import Pets from './paginas/pets';
import Produtos from './paginas/produtos';
import Servicos from './paginas/servicos';
import Relatorios from './paginas/relatorios';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Router>
  );
}
