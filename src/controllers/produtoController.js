import db from '../models/index.js';

export const listarProdutos = async (req, res) => {
  try {
    const produtos = await db.Produto.findAll({
      include: [{ model: db.Categoria }],
      order: [['criadoEm', 'DESC']]
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obterProduto = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id, {
      include: [{ model: db.Categoria }]
    });
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criarProduto = async (req, res) => {
  try {
    const produto = await db.Produto.create(req.body);
    const produtoCompleto = await db.Produto.findByPk(produto.id, {
      include: [{ model: db.Categoria }]
    });
    
    res.status(201).json(produtoCompleto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const atualizarProduto = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await produto.update(req.body);
    const produtoAtualizado = await db.Produto.findByPk(req.params.id, {
      include: [{ model: db.Categoria }]
    });
    
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletarProduto = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await produto.destroy();
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};