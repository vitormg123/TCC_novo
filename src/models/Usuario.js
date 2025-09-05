import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

const Usuario = sequelize.define('Usuario', {
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
        msg: 'Nome é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email deve ser válido'
      },
      notEmpty: {
        msg: 'Email é obrigatório'
      }
    }
  },
  senha: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Senha é obrigatória'
      },
      len: {
        args: [6, 100],
        msg: 'Senha deve ter pelo menos 6 caracteres'
      }
    }
  },
  tipo: { 
    type: DataTypes.ENUM('admin', 'usuario'), 
    defaultValue: 'usuario',
    validate: {
      isIn: {
        args: [['admin', 'usuario']],
        msg: 'Tipo deve ser admin ou usuario'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Telefone deve ter no máximo 20 caracteres'
      }
    }
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Data de nascimento deve ser válida'
      }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimoLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Avatar deve ser uma URL válida',
        allowEmpty: true
      }
    }
  }
}, {
  timestamps: true,
  tableName: 'usuarios',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  },
  instanceMethods: {
    verificarSenha: function(senha) {
      return bcrypt.compare(senha, this.senha);
    }
  }
});

export default Usuario;