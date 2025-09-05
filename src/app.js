import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';

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

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'sistema-crud-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Flash messages
app.use(flash());

// Middleware para tornar flash messages disponíveis em todas as views
app.use((req, res, next) => {
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    info: req.flash('info')
  };
  res.locals.user = req.user || null;
  res.locals.currentUrl = req.originalUrl;
  next();
});

// Configuração do PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/usuarios', usuarioRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'Sistema CRUD - Home',
    user: req.user
  });
});

// Rota para dashboard (após login)
app.get('/dashboard', (req, res) => {
  if (!req.user) {
    req.flash('error', 'Você precisa fazer login para acessar o dashboard');
    return res.redirect('/auth/login');
  }
  
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
});

// Rota para perfil do usuário
app.get('/perfil', (req, res) => {
  if (!req.user) {
    req.flash('error', 'Faça login para acessar seu perfil');
    return res.redirect('/auth/login');
  }
  
  res.render('auth/perfil', {
    title: 'Meu Perfil',
    user: req.user
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).render('error/404', {
    title: 'Página não encontrada',
    user: req.user
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(500).render('error/500', {
    title: 'Erro interno do servidor',
    user: req.user,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
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