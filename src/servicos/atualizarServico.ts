export async function atualizarServico(servico: any) {
  const resposta = await fetch('http://localhost:3001/servicos/atualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servico)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao atualizar serviço: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
