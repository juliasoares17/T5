export async function buscarServicos() {
  const resposta = await fetch('http://localhost:3001/servicos');

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao buscar serviços: ${texto}`);
  }

  return await resposta.json();
}
