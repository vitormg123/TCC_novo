import express from 'express';
import {
  listarCategorias,
  obterCategoria,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
  obterProdutosPorCategoria
} from '../controllers/categoriaController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listarCategorias);
router.get('/:id', obterCategoria);
router.get('/:id/produtos', obterProdutosPorCategoria);
router.post('/', authenticateToken, requireAdmin, criarCategoria);
router.put('/:id', authenticateToken, requireAdmin, atualizarCategoria);
router.delete('/:id', authenticateToken, requireAdmin, deletarCategoria);

export default router;