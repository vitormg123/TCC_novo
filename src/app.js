import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import produtoRoutes from './routes/produtos.js';
import categoriaRoutes from './routes/categorias.js';
import usuarioRoutes from './routes/usuarios.js';

// Import database
import db from './models/index.js';

// Configurações
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'Sistema CRUD com autenticação JWT' });
});

// Sincronizar banco e iniciar servidor
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexão com o banco estabelecida com sucesso.');
    
    await db.sequelize.sync({ force: false });
    console.log('Modelos sincronizados com o banco.');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    process.exit(1);
  }
};

startServer();

export default app;