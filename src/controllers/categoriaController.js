import db from '../models/index.js';

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await db.Categoria.findAll({
      order: [['nome', 'ASC']],
      include: [{
        model: db.Produto,
        attributes: ['id'],
        where: { ativo: true },
        required: false
      }],
      where: { ativa: true }
    });
    
    // Se for requisição API, retorna JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json(categorias);
    }
    
    // Se for requisição web, renderiza a view
    res.render('categorias/index', {
      title: 'Categorias',
      categorias,
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'Erro ao listar categorias' });
    }
    
    req.flash('error', 'Erro ao carregar categorias');
    res.redirect('/');
  }
};

export const obterCategoria = async (req, res) => {
  try {
    const categoria = await db.Categoria.findByPk(req.params.id, {
      include: [{
        model: db.Produto,
        where: { ativo: true },
        include: [db.Categoria]
      }]
    });
    
    if (!categoria) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      req.flash('error', 'Categoria não encontrada');
      return res.redirect('/categorias');
    }
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json(categoria);
    }
    
    res.render('categorias/detalhes', {
      title: `Categoria: ${categoria.nome}`,
      categoria,
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'Erro ao obter categoria' });
    }
    
    req.flash('error', 'Erro ao carregar categoria');
    res.redirect('/categorias');
  }
};

export const formNovaCategoria = (req, res) => {
  if (!req.user || req.user.tipo !== 'admin') {
    req.flash('error', 'Acesso restrito a administradores');
    return res.redirect('/categorias');
  }
  
  res.render('categorias/nova', {
    title: 'Nova Categoria',
    user: req.user
  });
};

export const formEditarCategoria = async (req, res) => {
  try {
    if (!req.user || req.user.tipo !== 'admin') {
      req.flash('error', 'Acesso restrito a administradores');
      return res.redirect('/categorias');
    }
    
    const categoria = await db.Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      req.flash('error', 'Categoria não encontrada');
      return res.redirect('/categorias');
    }
    
    res.render('categorias/editar', {
      title: 'Editar Categoria',
      categoria,
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao carregar formulário de edição:', error);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/categorias');
  }
};

export const criarCategoria = async (req, res) => {
  try {
    if (!req.user || req.user.tipo !== 'admin') {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
      }
      
      req.flash('error', 'Acesso restrito a administradores');
      return res.redirect('/categorias');
    }
    
    const { nome, descricao } = req.body;
    
    // Validações
    if (!nome || nome.trim().length < 2) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório (mínimo 2 caracteres)' });
      }
      
      req.flash('error', 'Nome da categoria é obrigatório (mínimo 2 caracteres)');
      return res.redirect('/categorias/nova');
    }
    
    // Verificar se categoria já existe
    const categoriaExistente = await db.Categoria.findOne({ 
      where: { 
        nome: nome.trim(),
        ativa: true
      } 
    });
    
    if (categoriaExistente) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(400).json({ error: 'Já existe uma categoria com este nome' });
      }
      
      req.flash('error', 'Já existe uma categoria com este nome');
      return res.redirect('/categorias/nova');
    }
    
    const categoria = await db.Categoria.create({
      nome: nome.trim(),
      descricao: descricao ? descricao.trim() : null
    });
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(201).json({
        message: 'Categoria criada com sucesso',
        categoria
      });
    }
    
    req.flash('success', 'Categoria criada com sucesso!');
    res.redirect('/categorias');
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
    
    req.flash('error', 'Erro ao criar categoria');
    res.redirect('/categorias/nova');
  }
};

export const atualizarCategoria = async (req, res) => {
  try {
    if (!req.user || req.user.tipo !== 'admin') {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
      }
      
      req.flash('error', 'Acesso restrito a administradores');
      return res.redirect('/categorias');
    }
    
    const categoria = await db.Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      req.flash('error', 'Categoria não encontrada');
      return res.redirect('/categorias');
    }
    
    const { nome, descricao, ativa } = req.body;
    
    // Validações
    if (!nome || nome.trim().length < 2) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório (mínimo 2 caracteres)' });
      }
      
      req.flash('error', 'Nome da categoria é obrigatório (mínimo 2 caracteres)');
      return res.redirect(`/categorias/editar/${req.params.id}`);
    }
    
    // Verificar se novo nome já existe (excluindo a própria categoria)
    const categoriaExistente = await db.Categoria.findOne({
      where: { 
        nome: nome.trim(),
        id: { [db.Sequelize.Op.ne]: req.params.id },
        ativa: true
      }
    });
    
    if (categoriaExistente) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(400).json({ error: 'Já existe uma categoria com este nome' });
      }
      
      req.flash('error', 'Já existe uma categoria com este nome');
      return res.redirect(`/categorias/editar/${req.params.id}`);
    }
    
    await categoria.update({
      nome: nome.trim(),
      descricao: descricao ? descricao.trim() : null,
      ativa: ativa === 'on' || ativa === true
    });
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json({
        message: 'Categoria atualizada com sucesso',
        categoria
      });
    }
    
    req.flash('success', 'Categoria atualizada com sucesso!');
    res.redirect('/categorias');
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
    
    req.flash('error', 'Erro ao atualizar categoria');
    res.redirect(`/categorias/editar/${req.params.id}`);
  }
};

export const deletarCategoria = async (req, res) => {
  try {
    if (!req.user || req.user.tipo !== 'admin') {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
      }
      
      req.flash('error', 'Acesso restrito a administradores');
      return res.redirect('/categorias');
    }
    
    const categoria = await db.Categoria.findByPk(req.params.id, {
      include: [{
        model: db.Produto,
        attributes: ['id'],
        where: { ativo: true },
        required: false
      }]
    });
    
    if (!categoria) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      req.flash('error', 'Categoria não encontrada');
      return res.redirect('/categorias');
    }
    
    // Verificar se existem produtos ativos associados
    if (categoria.Produtos && categoria.Produtos.length > 0) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(400).json({ 
          error: 'Não é possível excluir categoria com produtos ativos associados' 
        });
      }
      
      req.flash('error', 'Não é possível excluir categoria com produtos ativos associados');
      return res.redirect('/categorias');
    }
    
    // Soft delete - marcar como inativa
    await categoria.update({ ativa: false });
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json({ message: 'Categoria excluída com sucesso' });
    }
    
    req.flash('success', 'Categoria excluída com sucesso!');
    res.redirect('/categorias');
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ error: 'Erro ao excluir categoria' });
    }
    
    req.flash('error', 'Erro ao excluir categoria');
    res.redirect('/categorias');
  }
};

export const obterProdutosPorCategoria = async (req, res) => {
  try {
    const categoria = await db.Categoria.findByPk(req.params.id, {
      include: [{
        model: db.Produto,
        where: { ativo: true },
        include: [db.Categoria]
      }]
    });
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json(categoria.Produtos);
  } catch (error) {
    console.error('Erro ao obter produtos por categoria:', error);
    res.status(500).json({ error: 'Erro ao obter produtos' });
  }
};