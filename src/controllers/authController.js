import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;
    
    // Validações básicas
    if (senha !== confirmarSenha) {
      req.flash('error', 'As senhas não coincidem');
      return res.redirect('/auth/register');
    }
    
    const usuarioExistente = await db.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      req.flash('error', 'Email já cadastrado');
      return res.redirect('/auth/register');
    }

    const usuario = await db.Usuario.create({
      nome,
      email,
      senha
    });

    req.flash('success', 'Conta criada com sucesso! Faça login para continuar.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Erro no registro:', error);
    req.flash('error', 'Erro ao criar conta. Tente novamente.');
    res.redirect('/auth/register');
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha, lembrar } = req.body;
    
    const usuario = await db.Usuario.findOne({ where: { email } });
    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      req.flash('error', 'Email ou senha incorretos');
      return res.redirect('/auth/login');
    }

    if (!usuario.ativo) {
      req.flash('error', 'Sua conta está desativada. Entre em contato com o suporte.');
      return res.redirect('/auth/login');
    }

    // Gerar token JWT
    const token = generateToken({ 
      id: usuario.id, 
      email: usuario.email,
      tipo: usuario.tipo 
    });

    // Configurar cookie se "lembrar" estiver marcado
    if (lembrar) {
      res.cookie('remember_token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        httpOnly: true
      });
    }

    req.flash('success', `Bem-vindo(a) de volta, ${usuario.nome}!`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erro no login:', error);
    req.flash('error', 'Erro ao fazer login. Tente novamente.');
    res.redirect('/auth/login');
  }
};

export const logout = (req, res) => {
  res.clearCookie('remember_token');
  req.flash('success', 'Logout realizado com sucesso!');
  res.redirect('/auth/login');
};