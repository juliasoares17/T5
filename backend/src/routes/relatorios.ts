import { clientes } from './clientes'; 
import { pets } from './pets';
import { Router, Request, Response } from 'express';
import { produtos } from './produtos';
import { servicos } from './servicos';

const router = Router();

interface Consumo {
  tipo: 'produto' | 'servico';
  itemId: number;
  quantidade: number;
  idPet: number;
}

interface Cliente {
  id: number;
  nome: string;
  consumos?: Consumo[];
}

router.get('/top-produtos', (req: Request, res: Response) => {
  const produtosMap = new Map<number, number>();

  for (const cliente of clientes) {
    if (!cliente.consumos) continue;

    for (const consumo of cliente.consumos) {
      if (consumo.tipo === 'produto') {
        const atual = produtosMap.get(consumo.itemId) || 0;
        produtosMap.set(consumo.itemId, atual + consumo.quantidade);
      }
    }
  }

  const ranking = Array.from(produtosMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([itemId, quantidade]) => ({ itemId, total: quantidade })); // <-- Aqui foi alterado

  res.json(ranking);
});

router.get('/top-servicos', (req: Request, res: Response) => {
  const contador: Record<string, number> = {};

  for (const cliente of clientes) {
    for (const consumo of cliente.consumos || []) {
      if (consumo.tipo === 'servico') {
        const id = consumo.itemId;
        contador[id] = (contador[id] || 0) + Number(consumo.quantidade || 0);
      }
    }
  }

  const topServicos = Object.entries(contador)
    .map(([itemId, total]) => ({ itemId, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  res.json(topServicos);
});

router.get('/itens-por-tipo-raca', (req: Request, res: Response) => {
  const resultado: Record<string, {
    tipoPet: string;
    raca: string;
    produtos: Record<number, number>;
    servicos: Record<number, number>;
  }> = {};

  for (const cliente of clientes) {
    for (const consumo of cliente.consumos || []) {
      const idPet = Number(consumo.idPet);
      const itemId = Number(consumo.itemId);
      const quantidade = Number(consumo.quantidade);

      if (isNaN(idPet) || isNaN(itemId) || isNaN(quantidade)) continue;

      const pet = pets.find(p => p.id === idPet);
      if (!pet) continue;

      const chave = `${pet.tipo}||${pet.raca}`;
      if (!resultado[chave]) {
        resultado[chave] = {
          tipoPet: pet.tipo,
          raca: pet.raca,
          produtos: {},
          servicos: {},
        };
      }

      const grupo = resultado[chave];
      const alvo = consumo.tipo === 'produto' ? grupo.produtos : grupo.servicos;
      alvo[itemId] = (alvo[itemId] || 0) + quantidade;
    }
  }

  const resposta = Object.values(resultado).map(grupo => ({
    tipoPet: grupo.tipoPet,
    raca: grupo.raca,
    produtos: Object.entries(grupo.produtos).map(([itemId, total]) => ({
      itemId: Number(itemId),
      total
    })),
    servicos: Object.entries(grupo.servicos).map(([itemId, total]) => ({
      itemId: Number(itemId),
      total
    }))
  }));

  res.json(resposta);
});

router.get('/top10-clientes', (req: Request, res: Response) => {
  const ranking = clientes.map(cliente => {
    const totalConsumido = (cliente.consumos ?? []).reduce(
      (soma: number, consumo: { quantidade: number }) => {
        return soma + (Number(consumo.quantidade) || 0);
      },
      0
    );

    return {
      id: cliente.id,
      nome: cliente.nome,
      totalConsumido,
    };
  });

  const top10 = ranking
    .sort((a, b) => b.totalConsumido - a.totalConsumido)
    .slice(0, 10);

  res.json(top10);
});

const precosProdutos: Record<number, number> = {};
for (const produto of produtos) {
  precosProdutos[produto.id] = produto.preco;
}

const precosServicos: Record<number, number> = {};
for (const servico of servicos) {
  precosServicos[servico.id] = servico.preco;
}

router.get('/top5-clientes-valor', (req: Request, res: Response) => {
  const ranking = clientes.map(cliente => {
    const totalConsumido = (cliente.consumos ?? []).reduce((soma: number, consumo: Consumo) => {
      const preco = consumo.tipo === 'produto'
        ? precosProdutos[consumo.itemId]
        : precosServicos[consumo.itemId];
      return soma + (preco ?? 0) * consumo.quantidade;
    }, 0);

    return {
      id: cliente.id,
      nome: cliente.nome,
      totalGasto: totalConsumido,
    };
  })
  .sort((a, b) => b.totalGasto - a.totalGasto)
  .slice(0, 5);

  res.json(ranking);
});

export default router;

