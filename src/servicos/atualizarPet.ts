export async function atualizarPet(pet: any) {
  const resposta = await fetch('http://localhost:3001/pets/atualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao atualizar pet: ${texto}`);
  }

  return await resposta.json();
}
