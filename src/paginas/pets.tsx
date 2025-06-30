// src/paginas/Pets.tsx
import React, { useEffect, useState } from 'react';
import { buscarPets } from '../servicos/buscarPets';
import { cadastrarPet } from '../servicos/cadastrarPet';
import { atualizarPet } from '../servicos/atualizarPet';
import { excluirPet } from '../servicos/excluirPet';

export default function Pets() {
  const [pets, setPets] = useState<any[]>([]);
  const [modo, setModo] = useState<'listar' | 'editar' | 'cadastrar'>('listar');
  const [petAtual, setPetAtual] = useState<any | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const novoPet = {
    nome: '',
    raca: '',
    tipo: '',
    genero: '',
    cpfDono: ''
  };

  const [formulario, setFormulario] = useState<any>(novoPet);
  const obrigatorio = modo === 'cadastrar';

  useEffect(() => {
    carregarPets();
  }, []);

  const carregarPets = async () => {
    try {
      const dados = await buscarPets();
      setPets(dados);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'cadastrar') {
        await cadastrarPet(formulario);
        setMensagem('✅ Pet cadastrado com sucesso!');
      } else if (modo === 'editar') {
        if (!formulario.id) throw new Error('ID do pet ausente ao tentar atualizar.');
        await atualizarPet(formulario);
        setMensagem('✏️ Pet atualizado com sucesso!');
      }
      setModo('listar');
      setFormulario(novoPet);
      setPetAtual(null);
      carregarPets();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este pet?')) return;
    try {
      await excluirPet(id);
      setMensagem('🗑️ Pet excluído com sucesso.');
      carregarPets();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">🐾 Gerenciar Pets</h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      {modo === 'listar' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => { setModo('cadastrar'); setFormulario(novoPet); }}>
            ➕ Novo Pet
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Raça</th>
                <th>Tipo</th>
                <th>Gênero</th>
                <th>CPF do Dono</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(pet => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>{pet.nome}</td>
                  <td>{pet.raca}</td>
                  <td>{pet.tipo}</td>
                  <td>{pet.genero}</td>
                  <td>{pet.cpfDono}</td>
                  <td className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setModo('editar');
                        setFormulario({ ...pet, id: pet.id });
                        setPetAtual(pet);
                      }}
                    >
                      ✏️
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(pet.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {modo !== 'listar' && (
        <>
          <button className="btn btn-secondary mb-3" onClick={() => { setModo('listar'); setPetAtual(null); }}>
            ⬅ Voltar
          </button>

          <form onSubmit={handleSubmit}>
            <h4>{modo === 'cadastrar' ? 'Novo Pet' : `Editando: ${formulario.nome}`}</h4>

            <div className="mb-3">
              <label>Nome:</label>
              <input
                className="form-control"
                name="nome"
                value={formulario.nome || ''}
                onChange={handleChange}
                required={obrigatorio}
              />
            </div>

            <div className="mb-3">
              <label>Raça:</label>
              <input
                className="form-control"
                name="raca"
                value={formulario.raca || ''}
                onChange={handleChange}
                required={obrigatorio}
              />
            </div>

            <div className="mb-3">
              <label>Tipo:</label>
              <input
                className="form-control"
                name="tipo"
                value={formulario.tipo || ''}
                onChange={handleChange}
                required={obrigatorio}
              />
            </div>

            <div className="mb-3">
              <label>Gênero:</label>
              <input
                className="form-control"
                name="genero"
                value={formulario.genero || ''}
                onChange={handleChange}
                required={obrigatorio}
              />
            </div>

            <div className="mb-3">
              <label>CPF do Dono:</label>
              <input
                className="form-control"
                name="cpfDono"
                value={formulario.cpfDono || ''}
                onChange={handleChange}
                required={obrigatorio}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </form>
        </>
      )}
    </div>
  );
}
