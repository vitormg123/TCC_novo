import db from '../models/index.js';

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await db.Categoria.findAll({
      order: [['nome', 'ASC']],
      include: [{
        model: db.Produto,
        attributes: ['id']
      }]
    });
    
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obterCategoria = async (req, res) => {
  try {
    const categoria = await db.Categoria.findByPk(req.params.id, {
      include: [{
        model: db.Produto,
        include: [db.Categoria]
      }]
    });
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criarCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    
    // Verificar se categoria já existe
    const categoriaExistente = await db.Categoria.findOne({ where: { nome } });
    if (categoriaExistente) {
      return res.status(400).json({ error: 'Categoria já existe' });
    }
    
    const categoria = await db.Categoria.create({ nome });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const atualizarCategoria = async (req, res) => {
  try {
    const categoria = await db.Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    const { nome } = req.body;
    
    // Verificar se novo nome já existe (excluindo a própria categoria)
    const categoriaExistente = await db.Categoria.findOne({
      where: { 
        nome,
        id: { [db.Sequelize.Op.ne]: req.params.id }
      }
    });
    
    if (categoriaExistente) {
      return res.status(400).json({ error: 'Já existe uma categoria com este nome' });
    }
    
    await categoria.update({ nome });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletarCategoria = async (req, res) => {
  try {
    const categoria = await db.Categoria.findByPk(req.params.id, {
      include: [{
        model: db.Produto,
        attributes: ['id']
      }]
    });
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    // Verificar se existem produtos associados
    if (categoria.Produtos && categoria.Produtos.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir categoria com produtos associados