export async function atualizarProduto(produto: any) {
  const resposta = await fetch('http://localhost:3001/produtos/atualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao atualizar produto: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
