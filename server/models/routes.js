const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Route = sequelize.define('routes', {
  route_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  agency_id: DataTypes.STRING,
  route_short_name: DataTypes.STRING,
  route_long_name: DataTypes.STRING,
  route_type: DataTypes.STRING,
  route_color: DataTypes.STRING,
  route_text_color: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Route.insertRoutesFromJSON = async function () {
  try {
    const routes = JSON.parse(fs.readFileSync('../server/Data/routes.json', 'utf8'));
    await Route.bulkCreate(routes);
    console.log('✅ Données insérées dans la table routes');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des routes :', error);
  }
};

module.exports = Route;