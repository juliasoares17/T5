import { Router, Request, Response } from 'express';
import { deepMerge } from './utils/deepMerge'; 

const router = Router();

// Simulação de banco de dados em memória para pets
export let pets = [
  { id: 1, nome: 'Fido', tipo: 'Cachorro', raca: 'Labrador', cpfDono: '000.000.000-00' },
  { id: 2, nome: 'Miau', tipo: 'Gato', raca: 'Siamês', cpfDono: '111.111.111-11' },
  // ...
];

// GET /pets - listar todos os pets
router.get('/', (req: Request, res: Response) => {
  res.json(pets);
});

// POST /pets/cadastrar - cadastrar um pet novo
router.post('/cadastrar', (req: Request, res: Response) => {
  const { nome, raca, tipo, genero, cpfDono } = req.body;

  if (!nome || !raca || !tipo || !genero || !cpfDono) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const novoId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;

  const novoPet = { id: novoId, nome, raca, tipo, genero, cpfDono };

  pets.push(novoPet);

  res.status(201).json(novoPet);
});

// DELETE /pets/excluir - excluir pet pelo id (espera o id no body)
router.delete('/excluir', (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório para exclusão.' });
  }

  const index = pets.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Pet não encontrado.' });
  }

  pets.splice(index, 1);

  res.status(200).json({ mensagem: 'Pet excluído com sucesso.' });
});

// PUT /pets/atualizar - atualizar pet (usa deepMerge para atualizar parcialmente)
router.put('/atualizar', (req: Request, res: Response) => {
  const { id, ...dadosAtualizados } = req.body;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório para atualização.' });
  }

  const index = pets.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Pet não encontrado.' });
  }

  // atualiza parcialmente
  pets[index] = deepMerge(pets[index], dadosAtualizados);

  res.status(200).json(pets[index]);
});

export default router;
