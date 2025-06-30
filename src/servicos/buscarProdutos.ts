export async function buscarProdutos() {
  const resposta = await fetch('http://localhost:3001/produtos');

  if (!resposta.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return await resposta.json();
}
