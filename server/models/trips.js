const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const path = require('path');

const Trip = sequelize.define('trips', {
  trip_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  route_id: DataTypes.STRING,
  service_id: DataTypes.STRING,
  trip_headsign: DataTypes.STRING,
  direction_id: DataTypes.STRING,
  wheelchair_accessible: DataTypes.STRING,
  bikes_allowed: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Trip.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../Data/trips.json'), 'utf8'));
    const chunkSize = 1000;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await Trip.bulkCreate(chunk);
    }
    console.log('✅ Données insérées dans la table trips');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de trips :', error);
  }
};

module.exports = Trip;