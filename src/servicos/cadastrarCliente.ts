export async function cadastrarCliente(cliente: any) {
  const clienteFormatado = {
    nome: cliente.nome,
    nomeSocial: cliente.nomeSocial,
    cpf: cliente.cpf,
    dataEmissaoCpf: cliente.dataEmissaoCpf,
    rg: cliente.rg ?? '',
    telefone: cliente.telefone ?? '',
    email: cliente.email
  };

  const resposta = await fetch('http://localhost:3001/clientes/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clienteFormatado)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao cadastrar cliente: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
