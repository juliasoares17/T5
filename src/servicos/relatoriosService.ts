export async function buscarTopProdutos() {
  const resposta = await fetch('http://localhost:3001/relatorios/top-produtos');
  if (!resposta.ok) {
    throw new Error('Erro ao buscar top produtos');
  }
  return resposta.json();
}

export async function buscarTopServicos() {
  const resposta = await fetch('http://localhost:3001/relatorios/top-servicos');
  if (!resposta.ok) throw new Error('Erro ao buscar top serviços');
  return await resposta.json();
}

export async function buscarItensPorTipoRaca() {
  const resposta = await fetch('http://localhost:3001/relatorios/itens-por-tipo-raca');
  if (!resposta.ok) throw new Error('Erro ao buscar itens por tipo e raça de pet');
  return await resposta.json();
}

export async function buscarTop10Clientes() {
  const resposta = await fetch('http://localhost:3001/relatorios/top10-clientes');
  if (!resposta.ok) throw new Error('Erro ao buscar top clientes');
  return await resposta.json();
}

export async function buscarTop5Clientes() {
  const resposta = await fetch('http://localhost:3001/relatorios/top5-clientes-valor');
  if (!resposta.ok) {
    throw new Error('Erro ao buscar top clientes por valor');
  }
  return resposta.json();
}



