const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Stop = sequelize.define('stops', {
  stop_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  stop_name: DataTypes.STRING,
  stop_lon: DataTypes.STRING,
  stop_lat: DataTypes.STRING,
  zone_id: DataTypes.STRING,
  location_type: DataTypes.STRING,
  parent_station: DataTypes.STRING,
  stop_timezone: DataTypes.STRING,
  wheelchair_boarding: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Stop.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync('../server/Data/stops.json', 'utf8'));
    await Stop.bulkCreate(data);
    console.log('✅ Données insérées dans la table stops');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de stops :', error);
  }
};

module.exports = Stop;