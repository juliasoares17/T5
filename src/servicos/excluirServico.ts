export async function excluirServico(id: number) {
  const resposta = await fetch('http://localhost:3001/servicos/excluir', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao excluir serviço: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
