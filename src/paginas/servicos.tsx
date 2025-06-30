import React, { useEffect, useState } from 'react';
import { buscarServicos } from '../servicos/buscarServicos';
import { cadastrarServico } from '../servicos/cadastrarServico';
import { atualizarServico } from '../servicos/atualizarServico';
import { excluirServico } from '../servicos/excluirServico';

export default function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [modo, setModo] = useState<'listar' | 'editar' | 'cadastrar'>('listar');
  const [servicoAtual, setServicoAtual] = useState<any | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const novoServico = {
    nome: '',
    preco: '',
    duracao: ''
  };

  const [formulario, setFormulario] = useState<any>(novoServico);
  const obrigatorio = modo === 'cadastrar';

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const dados = await buscarServicos();
      setServicos(dados);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'cadastrar') {
        await cadastrarServico(formulario);
        setMensagem('✅ Serviço cadastrado com sucesso!');
      } else if (modo === 'editar') {
        if (!formulario.id) throw new Error('ID do serviço ausente ao tentar atualizar.');
        await atualizarServico(formulario);
        setMensagem('✏️ Serviço atualizado com sucesso!');
      }
      setModo('listar');
      setFormulario(novoServico);
      setServicoAtual(null);
      carregarServicos();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este serviço?')) return;
    try {
      await excluirServico(id);
      setMensagem('🗑️ Serviço excluído com sucesso.');
      carregarServicos();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">🛠️ Gerenciar Serviços</h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      {modo === 'listar' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => {
            setModo('cadastrar');
            setFormulario(novoServico);
          }}>
            ➕ Novo Serviço
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Duração</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map(servico => (
                <tr key={servico.id}>
                  <td>{servico.id}</td>
                  <td>{servico.nome}</td>
                  <td>R$ {Number(servico.preco).toFixed(2)}</td>
                  <td>{servico.duracao} min</td>
                  <td className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-warning btn-sm" onClick={() => {
                      setModo('editar');
                      setFormulario({ ...servico });
                      setServicoAtual(servico);
                    }}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(servico.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {modo !== 'listar' && (
        <>
          <button className="btn btn-secondary mb-3" onClick={() => {
            setModo('listar');
            setServicoAtual(null);
          }}>
            ⬅ Voltar
          </button>

          <form onSubmit={handleSubmit}>
            <h4>{modo === 'cadastrar' ? 'Novo Serviço' : `Editando: ${formulario.nome}`}</h4>

            <div className="mb-3">
              <label>Nome:</label>
              <input
                className="form-control"
                name="nome"
                value={formulario.nome || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Preço (R$):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                name="preco"
                value={formulario.preco || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Duração (minutos):</label>
              <input
                type="number"
                min="1"
                className="form-control"
                name="duracao"
                value={formulario.duracao || ''}
                onChange={handleChange}
                required
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
