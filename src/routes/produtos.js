import express from 'express';
import {
  listarProdutos,
  obterProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtoController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listarProdutos);
router.get('/:id', obterProduto);
router.post('/', authenticateToken, requireAdmin, criarProduto);
router.put('/:id', authenticateToken, requireAdmin, atualizarProduto);
router.delete('/:id', authenticateToken, requireAdmin, deletarProduto);

export default router;