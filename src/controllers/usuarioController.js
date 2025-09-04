import db from '../models/index.js';

export const listarUsuarios = async (req, res) => {
  try {
    // Apenas administradores podem listar usuários
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }
    
    const usuarios = await db.Usuario.findAll({
      attributes: { exclude: ['senha'] },
      order: [['nome', 'ASC']]
    });
    
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obterUsuario = async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Usuários só podem ver seu próprio perfil, a menos que sejam admin
    if (req.user.id !== usuario.id && req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Usuários só podem atualizar seu próprio perfil, a menos que sejam admin
    if (req.user.id !== usuario.id && req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    
    const { nome, email, tipo } = req.body;
    
    // Verificar se email já existe (excluindo o próprio usuário)
    if (email && email !== usuario.email) {
      const usuarioExistente = await db.Usuario.findOne({
        where: { 
          email,
          id: { [db.Sequelize.Op.ne]: req.params.id }
        }
      });
      
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }
    
    // Apenas administradores podem alterar o tipo de usuário
    const dadosAtualizacao = { nome, email };
    if (req.user.tipo === 'admin' && tipo) {
      dadosAtualizacao.tipo = tipo;
    }
    
    await usuario.update(dadosAtualizacao);
    
    // Retornar usuário sem a senha
    const usuarioAtualizado = await db.Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const atualizarPerfil = async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const { nome, email } = req.body;
    
    // Verificar se email já existe (excluindo o próprio usuário)
    if (email && email !== usuario.email) {
      const usuarioExistente = await db.Usuario.findOne({
        where: { 
          email,
          id: { [db.Sequelize.Op.ne]: req.user.id }
        }
      });
      
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }
    
    await usuario.update({ nome, email });
    
    // Retornar usuário sem a senha
    const usuarioAtualizado = await db.Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] }
    });
    
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }
    
    const usuario = await db.Usuario.findByPk(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar senha atual
    const bcrypt = await import('bcryptjs');
    const isSenhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    
    if (!isSenhaValida) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    
    // Atualizar senha
    usuario.senha = novaSenha;
    await usuario.save();
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    // Apenas administradores podem deletar usuários
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }
    
    // Impedir que um administrador se delete
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ error: 'Não é possível excluir sua própria conta' });
    }
    
    const usuario = await db.Usuario.findByPk(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};