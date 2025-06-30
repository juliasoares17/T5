export async function excluirPet(id: number) {
  const resposta = await fetch('http://localhost:3001/pets/excluir', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao excluir pet: ${texto}`);
  }

  return await resposta.json();
}
