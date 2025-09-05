import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Produto = sequelize.define('Produto', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do produto é obrigatório'
      },
      len: {
        args: [2, 200],
        msg: 'Nome deve ter entre 2 e 200 caracteres'
      }
    }
  },
  descricao: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Descrição do produto é obrigatória'
      },
      len: {
        args: [10, 2000],
        msg: 'Descrição deve ter entre 10 e 2000 caracteres'
      }
    }
  },
  preco: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Preço deve ser um número válido'
      },
      min: {
        args: [0],
        msg: 'Preço não pode ser negativo'
      }
    }
  },
  desconto: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0,
    validate: {
      isFloat: {
        msg: 'Desconto deve ser um número válido'
      },
      min: {
        args: [0],
        msg: 'Desconto não pode ser negativo'
      },
      max: {
        args: [100],
        msg: 'Desconto não pode ser maior que 100%'
      }
    }
  },
  tamanho: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tamanho é obrigatório'
      }
    }
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Não especificado'
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imagem: { 
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Imagem deve ser uma URL válida',
        allowEmpty: true
      }
    }
  },
  imagens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Estoque deve ser um número inteiro'
      },
      min: {
        args: [0],
        msg: 'Estoque não pode ser negativo'
      }
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: {
        msg: 'Peso deve ser um número válido'
      },
      min: {
        args: [0],
        msg: 'Peso não pode ser negativo'
      }
    }
  },
  dimensoes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  criadoEm: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  atualizadoEm: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  quantidadeVendida: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Quantidade vendida deve ser um número inteiro'
      },
      min: {
        args: [0],
        msg: 'Quantidade vendida não pode ser negativa'
      }
    }
  },
  avaliacao: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      isFloat: {
        msg: 'Avaliação deve ser um número válido'
      },
      min: {
        args: [0],
        msg: 'Avaliação não pode ser negativa'
      },
      max: {
        args: [5],
        msg: 'Avaliação não pode ser maior que 5'
      }
    }
  },
  totalAvaliacoes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  emDestaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'produtos',
  hooks: {
    beforeValidate: (produto) => {
      if (produto.preco && produto.desconto > 0) {
        // Garantir que o preço com desconto não seja negativo
        const precoComDesconto = produto.preco * (1 - produto.desconto / 100);
        if (precoComDesconto < 0) {
          throw new Error('Preço com desconto não pode ser negativo');
        }
      }
    },
    beforeCreate: (produto) => {
      // Gerar SKU automático se não fornecido
      if (!produto.sku) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        produto.sku = `SKU-${timestamp}-${random}`.toUpperCase();
      }
    }
  },
  getterMethods: {
    precoComDesconto() {
      if (this.desconto > 0) {
        return this.preco * (1 - this.desconto / 100);
      }
      return this.preco;
    },
    emEstoque() {
      return this.estoque > 0;
    }
  }
});

export default Produto;