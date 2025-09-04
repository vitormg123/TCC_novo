import db from '../models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const criarProduto = async (req, res) => {
  try {
    let imagemPath = null;
    
    if (req.file) {
      imagemPath = `/uploads/${req.file.filename}`;
    }
    
    const produtoData = {
      ...req.body,
      imagem: imagemPath,
      preco: parseFloat(req.body.preco),
      desconto: parseFloat(req.body.desconto) || 0,
      categoriaId: parseInt(req.body.categoriaId)
    };
    
    const produto = await db.Produto.create(produtoData);
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

    let dadosAtualizacao = { ...req.body };
    
    if (req.file) {
      dadosAtualizacao.imagem = `/uploads/${req.file.filename}`;
    }
    
    // Converter tipos numéricos
    if (dadosAtualizacao.preco) {
      dadosAtualizacao.preco = parseFloat(dadosAtualizacao.preco);
    }
    if (dadosAtualizacao.desconto) {
      dadosAtualizacao.desconto = parseFloat(dadosAtualizacao.desconto);
    }
    if (dadosAtualizacao.categoriaId) {
      dadosAtualizacao.categoriaId = parseInt(dadosAtualizacao.categoriaId);
    }

    await produto.update(dadosAtualizacao);
    const produtoAtualizado = await db.Produto.findByPk(req.params.id, {
      include: [{ model: db.Categoria }]
    });
    
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};