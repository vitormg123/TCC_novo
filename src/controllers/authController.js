import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    const usuarioExistente = await db.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const usuario = await db.Usuario.create({
      nome,
      email,
      senha
    });

    const token = generateToken({ id: usuario.id, email: usuario.email });
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const usuario = await db.Usuario.findOne({ where: { email } });
    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken({ id: usuario.id, email: usuario.email });
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};