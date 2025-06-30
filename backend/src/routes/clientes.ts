// src/routes/clientes.ts
import { Router, Request, Response } from 'express';
import { deepMerge } from './utils/deepMerge';

const router = Router();

// Simulação de banco de dados em memória
let clientes = [
  {
    id: 1,
    nome: 'Cliente A',
    nomeSocial: 'A',
    cpf: '000.000.000-00',
    dataEmissaoCpf: '2020-01-01',
    rg: '',
    telefone: '',
    email: ''
  },
  {
    id: 2,
    nome: 'Cliente B',
    nomeSocial: 'B',
    cpf: '111.111.111-11',
    dataEmissaoCpf: '2021-05-10',
    rg: 'MG-12.345.678',
    telefone: '31999999999',
    email: 'b@email.com'
  }
];

// GET /clientes
router.get('/', (req: Request, res: Response) => {
  res.json(clientes);
});

// POST /clientes/cadastrar
router.post('/cadastrar', (req: Request, res: Response) => {
  const { nome, cpf, dataEmissaoCpf } = req.body;

  if (!nome || !cpf || !dataEmissaoCpf) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes: nome, cpf, dataEmissaoCpf' });
  }

  const novoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
  const novoCliente = { id: novoId, ...req.body };

  clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});


// DELETE /clientes/excluir
router.delete('/excluir', (req: Request, res: Response) => {
  const { id } = req.body;

  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  clientes.splice(index, 1);
  res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
});

router.put('/atualizar', (req: Request, res: Response) => {
  console.log('Rota PUT /clientes/atualizar chamada com dados:', req.body);

  const { id, ...dadosAtualizados } = req.body;
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  clientes[index] = deepMerge(clientes[index], dadosAtualizados);
  res.status(200).json(clientes[index]);
});


export default router;

