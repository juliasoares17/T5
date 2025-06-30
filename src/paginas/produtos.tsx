import React, { useEffect, useState } from 'react';
import { buscarProdutos } from '../servicos/buscarProdutos';
import { cadastrarProduto } from '../servicos/cadastrarProduto';
import { atualizarProduto } from '../servicos/atualizarProduto';
import { excluirProduto } from '../servicos/excluirProduto';

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [modo, setModo] = useState<'listar' | 'editar' | 'cadastrar'>('listar');
  const [produtoAtual, setProdutoAtual] = useState<any | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const novoProduto = {
    nome: '',
    preco: ''
  };

  const [formulario, setFormulario] = useState<any>(novoProduto);
  const obrigatorio = modo === 'cadastrar';

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const dados = await buscarProdutos();
      setProdutos(dados);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'cadastrar') {
        await cadastrarProduto(formulario);
        setMensagem('✅ Produto cadastrado com sucesso!');
      } else if (modo === 'editar') {
        if (!formulario.id) throw new Error('ID do produto ausente ao tentar atualizar.');
        await atualizarProduto(formulario);
        setMensagem('✏️ Produto atualizado com sucesso!');
      }
      setModo('listar');
      setFormulario(novoProduto);
      setProdutoAtual(null);
      carregarProdutos();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;
    try {
      await excluirProduto(id);
      setMensagem('🗑️ Produto excluído com sucesso.');
      carregarProdutos();
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
      <h2 className="mb-4">📦 Gerenciar Produtos</h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      {modo === 'listar' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => {
            setModo('cadastrar');
            setFormulario(novoProduto);
          }}>
            ➕ Novo Produto
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>R$ {Number(produto.preco).toFixed(2)}</td>
                  <td className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-warning btn-sm" onClick={() => {
                      setModo('editar');
                      setFormulario({ ...produto, id: produto.id });
                      setProdutoAtual(produto);
                    }}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(produto.id)}>🗑️</button>
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
            setProdutoAtual(null);
          }}>
            ⬅ Voltar
          </button>

          <form onSubmit={handleSubmit}>
            <h4>{modo === 'cadastrar' ? 'Novo Produto' : `Editando: ${formulario.nome}`}</h4>
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
              <label>Preço:</label>
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

            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </form>
        </>
      )}
    </div>
  );
}

