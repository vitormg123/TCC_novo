import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Categoria = sequelize.define('Categoria', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Nome da categoria é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Descrição deve ter no máximo 500 caracteres'
      }
    }
  },
  ativa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'categorias',
  indexes: [
    {
      unique: true,
      fields: ['nome']
    }
  ]
});

export default Categoria;