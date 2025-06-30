export async function buscarPets() {
  const resposta = await fetch('http://localhost:3001/pets');
  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro ao buscar pets: ${texto}`);
  }
  return await resposta.json();
}
