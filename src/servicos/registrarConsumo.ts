export async function registrarConsumo(registro: {
  idCliente: number;
  tipo: 'produto' | 'servico';
  itemId: number;
  quantidade: number;
}) {
  const resposta = await fetch('http://localhost:3001/clientes/registrar-consumo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao registrar consumo: ${texto}`);
  }

  return await resposta.json().catch(() => ({}));
}
