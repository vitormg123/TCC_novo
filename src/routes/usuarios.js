import express from 'express';
import {
  listarUsuarios,
  obterUsuario,
  obterPerfil,
  atualizarUsuario,
  atualizarPerfil,
  alterarSenha,
  deletarUsuario
} from '../controllers/usuarioController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas (com autenticação)
router.get('/perfil', authenticateToken, obterPerfil);
router.put('/perfil', authenticateToken, atualizarPerfil);
router.put('/alterar-senha', authenticateToken, alterarSenha);

// Rotas administrativas
router.get('/', authenticateToken, requireAdmin, listarUsuarios);
router.get('/:id', authenticateToken, obterUsuario);
router.put('/:id', authenticateToken, atualizarUsuario);
router.delete('/:id', authenticateToken, requireAdmin, deletarUsuario);

export default router;