export async function buscarClientes() {
  const resposta = await fetch('http://localhost:3001/clientes');
  const dados = await resposta.json();

  if (!resposta.ok) {
    const erro = dados?.mensagem || JSON.stringify(dados);
    throw new Error(erro);
  }

  return dados;
}
