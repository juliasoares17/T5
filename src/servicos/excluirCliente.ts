export async function excluirCliente(id: number) {
  const resposta = await fetch('http://localhost:3001/clientes/excluir', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao excluir cliente: ${texto}`);
  }

  return true;
}
