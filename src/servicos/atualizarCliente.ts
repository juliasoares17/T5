export async function atualizarCliente(cliente: any) {
  if (!cliente.id) {
    throw new Error('Cliente sem ID ao tentar atualizar');
  }

  const clienteFormatado = {
    id: cliente.id,
    nome: cliente.nome,
    nomeSocial: cliente.nomeSocial,
    cpf: cliente.cpf,
    dataEmissaoCpf: cliente.dataEmissaoCpf,
    rg: cliente.rg ?? '',
    telefone: cliente.telefone ?? '',
    email: cliente.email
  };

  const resposta = await fetch('http://localhost:3001/clientes/atualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clienteFormatado)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao atualizar cliente: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}

