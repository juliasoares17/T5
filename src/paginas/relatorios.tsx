import React, { useEffect, useState } from 'react';
import {
  buscarClientes
} from '../servicos/buscarClientes';
import {
  buscarTopProdutos,
  buscarTopServicos,
  buscarItensPorTipoRaca,
  buscarTop10Clientes,
  buscarTop5Clientes
} from '../servicos/relatoriosService';

// Interfaces
interface Consumo {
  tipo: 'produto' | 'servico';
  itemId: string;
  quantidade: number;
  idPet: string;
}

interface Cliente {
  id: number;
  nome: string;
  nomeSocial: string;
  cpf: string;
  dataEmissaoCpf: string;
  rg: string;
  telefone: string;
  email: string;
  consumos?: Consumo[];
}

interface ItemMaisConsumido {
  itemId: string;
  total: number;
}

interface ItensPorTipoRaca {
  tipoPet: string;
  raca: string;
  produtos: { itemId: number; total: number }[];
  servicos: { itemId: number; total: number }[];
}

interface ClienteTop {
  id: number;
  nome: string;
  totalConsumido: number;
}

interface ClienteValor {
  id: number;
  nome: string;
  totalGasto: number;
}

export default function Relatorios() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [haConsumos, setHaConsumos] = useState(false);
  const [topProdutos, setTopProdutos] = useState<ItemMaisConsumido[]>([]);
  const [topServicos, setTopServicos] = useState<ItemMaisConsumido[]>([]);
  const [itensPorTipoRaca, setItensPorTipoRaca] = useState<ItensPorTipoRaca[]>([]);
  const [topClientes, setTopClientes] = useState<ClienteTop[]>([]);
  const [topClientesValor, setTopClientesValor] = useState<ClienteValor[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await buscarClientes();
        setClientes(dados);

        const possuiConsumos = dados.some((c: Cliente) => (c.consumos ?? []).length > 0);
        setHaConsumos(possuiConsumos);

        if (possuiConsumos) {
          const produtos = await buscarTopProdutos();
          const servicos = await buscarTopServicos();
          const porTipoRaca = await buscarItensPorTipoRaca();
          const clientesTop = await buscarTop10Clientes();
          const clientesValor = await buscarTop5Clientes();

          setTopProdutos(produtos);
          setTopServicos(servicos);
          setItensPorTipoRaca(porTipoRaca);
          setTopClientes(clientesTop);
          setTopClientesValor(clientesValor);
        }
      } catch (erro: any) {
        console.error('Erro ao buscar relatórios:', erro.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">📊 Relatórios</h2>

      {carregando ? (
        <p>Carregando dados...</p>
      ) : !haConsumos ? (
        <div className="alert alert-warning">
          Não há informações o suficiente para gerar nenhum relatório.
        </div>
      ) : (
        <div>
          {/* Produtos mais consumidos */}
          {topProdutos.length > 0 && (
            <div className="mb-5">
              <h5>🔝 Top Produtos Mais Consumidos</h5>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID do Produto</th>
                    <th>Quantidade Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topProdutos.map((produto, index) => (
                    <tr key={produto.itemId}>
                      <td>{index + 1}</td>
                      <td>{produto.itemId}</td>
                      <td>{Number(produto.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Serviços mais consumidos */}
          {topServicos.length > 0 && (
            <div className="mb-5">
              <h5>🛠️ Top Serviços Mais Consumidos</h5>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID do Serviço</th>
                    <th>Quantidade Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topServicos.map((servico, index) => (
                    <tr key={servico.itemId}>
                      <td>{index + 1}</td>
                      <td>{servico.itemId}</td>
                      <td>{servico.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Itens por tipo e raça */}
          {itensPorTipoRaca.length > 0 && (
            <div className="mb-5">
              <h5>🐾 Itens Mais Consumidos por Tipo e Raça de Pet</h5>
              {itensPorTipoRaca.map((grupo, i) => (
                <div key={`${grupo.tipoPet}-${grupo.raca}-${i}`} className="mb-4">
                  <h6>{grupo.tipoPet} - {grupo.raca}</h6>

                  {grupo.produtos.length > 0 && (
                    <div className="mb-2">
                      <h6>🧴 Produtos</h6>
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ID do Produto</th>
                            <th>Quantidade Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.produtos.map((item, idx) => (
                            <tr key={item.itemId}>
                              <td>{idx + 1}</td>
                              <td>{item.itemId}</td>
                              <td>{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {grupo.servicos.length > 0 && (
                    <div className="mb-4">
                      <h6>🛠️ Serviços</h6>
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ID do Serviço</th>
                            <th>Quantidade Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.servicos.map((item, idx) => (
                            <tr key={item.itemId}>
                              <td>{idx + 1}</td>
                              <td>{item.itemId}</td>
                              <td>{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Top 10 clientes por quantidade */}
          {topClientes.length > 0 && (
            <div className="mb-5">
              <h5>👥 Top 10 Clientes por Quantidade Consumida</h5>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Total de Itens Consumidos</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientes.map((cliente, index) => (
                    <tr key={cliente.id}>
                      <td>{index + 1}</td>
                      <td>{cliente.id}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.totalConsumido}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Top 5 clientes por valor */}
          {topClientesValor.length > 0 && (
            <div className="mb-5">
              <h5>💰 Top 5 Clientes por Valor Total Gasto</h5>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Valor Total Gasto (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientesValor.map((cliente, index) => (
                    <tr key={cliente.id}>
                      <td>{index + 1}</td>
                      <td>{cliente.id}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.totalGasto.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}





