// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes/navbar'
import Home from './paginas/home';
import Clientes from './paginas/clientes';
import Pets from './paginas/pets';
import Produtos from './paginas/produtos';

// (outras páginas vão entrar aqui depois)
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/produtos" element={<Produtos />} />
        {/* adicionar mais rotas depois */}
      </Routes>
    </Router>
  );
}
