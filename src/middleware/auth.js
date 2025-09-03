import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    const decoded = verifyToken(token);
    const usuario = await db.Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
};