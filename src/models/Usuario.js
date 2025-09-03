import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.ENUM('admin', 'usuario'), defaultValue: 'usuario' }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (usuario) => {
      if (usuario.senha) {
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
      }
    },
    beforeUpdate: (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
      }
    }
  }
});

export default Usuario;