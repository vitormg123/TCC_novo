import sequelize from '../config/db.js';
import Usuario from './Usuario.js';
import Categoria from './Categoria.js';
import Produto from './Produto.js';

// Definir associações
Categoria.hasMany(Produto, { foreignKey: 'categoriaId' });
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

const db = {
  sequelize,
  Usuario,
  Categoria,
  Produto
};

export default db;