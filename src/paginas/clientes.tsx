import React, { useEffect, useState } from 'react';
import { buscarClientes } from '../servicos/buscarClientes';
import { buscarPets } from '../servicos/buscarPets';
import { cadastrarCliente } from '../servicos/cadastrarCliente';
import { atualizarCliente } from '../servicos/atualizarCliente';
import { excluirCliente } from '../servicos/excluirCliente';
import { registrarConsumo } from '../servicos/registrarConsumo';

export default function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [petsDoCliente, setPetsDoCliente] = useState<any[]>([]);
  const [modo, setModo] = useState<'listar' | 'editar' | 'cadastrar' | 'consumo'>('listar');
  const [clienteAtual, setClienteAtual] = useState<any | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const novoCliente = {
    nome: '', nomeSocial: '', cpf: '', dataEmissaoCpf: '', rg: '', telefone: '', email: ''
  };

  const [formulario, setFormulario] = useState<any>(novoCliente);
  const obrigatorio = modo === 'cadastrar';

  useEffect(() => {
    carregarClientes();
    carregarPets();
  }, []);

  useEffect(() => {
    if (modo === 'consumo' && clienteAtual) {
      const relacionados = pets.filter(p => p.cpfDono === clienteAtual.cpf);
      setPetsDoCliente(relacionados);
    }
  }, [modo, clienteAtual, pets]);

  const carregarClientes = async () => {
    try {
      const dados = await buscarClientes();
      setClientes(dados);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const carregarPets = async () => {
    try {
      const dados = await buscarPets();
      setPets(dados);
    } catch (e: any) {
      setErro('Erro ao carregar pets: ' + e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'cadastrar') {
        await cadastrarCliente(formulario);
        setMensagem('✅ Cliente cadastrado com sucesso!');
      } else if (modo === 'editar') {
        if (!formulario.id) throw new Error('ID do cliente ausente ao tentar atualizar.');
        await atualizarCliente(formulario);
        setMensagem('✏️ Cliente atualizado com sucesso!');
      } else if (modo === 'consumo') {
        if (petsDoCliente.length === 0) {
          setErro('Este cliente não possui pets cadastrados.');
          return;
        }
        await registrarConsumo(formulario);
        setMensagem('🛒 Consumo registrado!');
      }
      setModo('listar');
      setFormulario(novoCliente);
      setClienteAtual(null);
      carregarClientes();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await excluirCliente(id);
      setMensagem('🗑️ Cliente excluído com sucesso.');
      carregarClientes();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">👥 Gerenciar Clientes</h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      {modo === 'listar' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => { setModo('cadastrar'); setFormulario(novoCliente); }}>
            ➕ Novo Cliente
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Nome Social</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <React.Fragment key={cliente.id}>
                  <tr>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.nomeSocial}</td>
                    <td>{cliente.cpf}</td>
                    <td>{cliente.email ?? '—'}</td>
                    <td className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-warning btn-sm" onClick={() => {
                        setModo('editar');
                        setFormulario({ ...cliente, id: cliente.id });
                        setClienteAtual(cliente);
                      }}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(cliente.id)}>🗑️</button>
                      <button className="btn btn-info btn-sm" onClick={() => {
                        setModo('consumo');
                        setFormulario({ idCliente: cliente.id, tipo: '', itemId: '', quantidade: 1, idPet: '' });
                        setClienteAtual(cliente);
                      }}>🛒</button>
                    </td>
                  </tr>

                  {/* Exibe consumos, se houver */}
                  {cliente.consumos?.length > 0 && (
  <tr>
    <td colSpan={6}>
      <strong>🧾 Consumos Registrados:</strong>
      <table className="table table-sm mt-2">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>ID do Produto/Serviço</th>
            <th>Pet</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {cliente.consumos.map((consumo: any, i: number) => {
            const pet = pets.find(p => String(p.id) === String(consumo.idPet));
            return (
              <tr key={i}>
                <td>{consumo.tipo}</td>
                <td>{consumo.itemId}</td>
                <td>{pet ? `${pet.nome} (${pet.tipo}, ${pet.raca})` : 'Pet não encontrado'}</td>
                <td>{consumo.quantidade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </td>
  </tr>
)}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}

      {modo !== 'listar' && (
        <>
          <button className="btn btn-secondary mb-3" onClick={() => { setModo('listar'); setClienteAtual(null); }}>
            ⬅ Voltar
          </button>

          <form onSubmit={handleSubmit}>
            {modo === 'consumo' ? (
              <>
                <h4>Registrar Consumo para: {clienteAtual?.nome}</h4>

                {petsDoCliente.length === 0 ? (
                  <div className="alert alert-warning">
                    Este cliente não possui pets cadastrados. Registre um pet antes de registrar consumo.
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label>Tipo (produto ou servico):</label>
                      <input className="form-control" name="tipo" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label>ID do Produto/Serviço:</label>
                      <input className="form-control" name="itemId" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label>Quantidade:</label>
                      <input type="number" className="form-control" name="quantidade" min={1} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label>Pet que consumiu:</label>
                      <select className="form-control" name="idPet" onChange={handleChange} required>
                        <option value="">Selecione um pet</option>
                        {petsDoCliente.map((pet: any) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.nome} ({pet.tipo}, {pet.raca})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <h4>{modo === 'cadastrar' ? 'Novo Cliente' : `Editando: ${formulario.nome}`}</h4>

                <div className="mb-3">
                  <label>Nome:</label>
                  <input className="form-control" name="nome" value={formulario.nome || ''} onChange={handleChange} required={obrigatorio} />
                </div>

                <div className="mb-3">
                  <label>Nome Social:</label>
                  <input className="form-control" name="nomeSocial" value={formulario.nomeSocial || ''} onChange={handleChange} required={obrigatorio} />
                </div>

                <div className="mb-3">
                  <label>CPF:</label>
                  <input className="form-control" name="cpf" value={formulario.cpf || ''} onChange={handleChange} required={obrigatorio} />
                </div>

                <div className="mb-3">
                  <label>Data de Emissão do CPF:</label>
                  <input type="date" className="form-control" name="dataEmissaoCpf" value={formulario.dataEmissaoCpf || ''} onChange={handleChange} required={obrigatorio} />
                </div>

                <div className="mb-3">
                  <label>RG:</label>
                  <input className="form-control" name="rg" value={formulario.rg || ''} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label>Telefone:</label>
                  <input className="form-control" name="telefone" value={formulario.telefone || ''} onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label>Email:</label>
                  <input className="form-control" name="email" value={formulario.email || ''} onChange={handleChange} required={obrigatorio} />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary">
              {modo === 'consumo' ? 'Registrar Consumo' : 'Salvar'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}



