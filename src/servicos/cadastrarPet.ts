export async function cadastrarPet(pet: any) {
  const resposta = await fetch('http://localhost:3001/pets/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet)
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao cadastrar pet: ${texto}`);
  }

  return await resposta.json();
}
