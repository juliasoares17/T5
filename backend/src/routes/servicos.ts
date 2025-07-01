import { Router, Request, Response } from 'express';
import { deepMerge } from './utils/deepMerge';

const router = Router();


export let servicos: any[] = [
  { id: 1, nome: 'Banho e Tosa', preco: 80.00, duracao: 60 },
  { id: 2, nome: 'Consulta Veterinária', preco: 150.00, duracao: 45 }
];


router.get('/', (req: Request, res: Response) => {
  res.json(servicos);
});


router.post('/cadastrar', (req: Request, res: Response) => {
  const novoServico = req.body;

  if (!novoServico.nome || !novoServico.preco || !novoServico.duracao) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, preço e duração (em minutos).' });
  }

  const novoId = servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1;
  novoServico.id = novoId;
  servicos.push(novoServico);
  res.status(201).json(novoServico);
});


router.put('/atualizar', (req: Request, res: Response) => {
  const { id, ...dadosAtualizados } = req.body;
  const index = servicos.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Serviço não encontrado' });
  }

  servicos[index] = deepMerge(servicos[index], dadosAtualizados);
  res.status(200).json(servicos[index]);
});

router.delete('/excluir', (req: Request, res: Response) => {
  const { id } = req.body;
  const index = servicos.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Serviço não encontrado' });
  }

  servicos.splice(index, 1);
  res.status(200).json({ mensagem: 'Serviço excluído com sucesso' });
});

export default router;

