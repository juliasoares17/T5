import { Router, Request, Response } from 'express';
import { deepMerge } from './utils/deepMerge';

const router = Router();

let produtos: any[] = [
  { id: 1, nome: 'Ração Premium', preco: 120.00 },
  { id: 2, nome: 'Brinquedo para Gato', preco: 45.50 }
];

router.get('/', (req: Request, res: Response) => {
  res.json(produtos);
});

router.post('/cadastrar', (req: Request, res: Response) => {
  const novoProduto = req.body;

  if (!novoProduto.nome || !novoProduto.preco) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome e preço.' });
  }
  const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
  novoProduto.id = novoId;
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

router.put('/atualizar', (req: Request, res: Response) => {
  const { id, ...dadosAtualizados } = req.body;
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos[index] = deepMerge(produtos[index], dadosAtualizados);
  res.status(200).json(produtos[index]);
});

router.delete('/excluir', (req: Request, res: Response) => {
  const { id } = req.body;
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
});

export default router;
