import sequelize from '../config/db.js';
import Usuario from './Usuario.js';
import Categoria from './Categoria.js';
import Produto from './Produto.js';

// Definir associações
Categoria.hasMany(Produto, { 
  foreignKey: 'categoriaId', 
  as: 'produtos',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Produto.belongsTo(Categoria, { 
  foreignKey: 'categoriaId', 
  as: 'categoria',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Sincronizar modelos
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados com o banco de dados');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
};

const db = {
  sequelize,
  Usuario,
  Categoria,
  Produto,
  syncModels
};

export default db;