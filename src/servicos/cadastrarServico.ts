export async function cadastrarServico(servico: any) {
  const resposta = await fetch('http://localhost:3001/servicos/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servico)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao cadastrar serviço: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
