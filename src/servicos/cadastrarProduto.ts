export async function cadastrarProduto(produto: any) {
  const resposta = await fetch('http://localhost:3001/produtos/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao cadastrar produto: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
