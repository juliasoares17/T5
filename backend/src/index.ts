import express from 'express';
import cors from 'cors';
import clientesRouter from './routes/clientes';
import petsRouter from './routes/pets';
import produtosRouter from './routes/produtos';
import servicosRouter from './routes/servicos';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRouter); 
app.use('/pets', petsRouter); 
app.use('/produtos', produtosRouter);
app.use('/servicos', servicosRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
