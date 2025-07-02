const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const fs = require('fs');

const StopTime = sequelize.define('stop_times', {
  trip_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  stop_sequence: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  stop_id: DataTypes.STRING,
  arrival_time: DataTypes.STRING,
  departure_time: DataTypes.STRING,
  pickup_type: DataTypes.STRING,
  drop_off_type: DataTypes.STRING,
  timepoint: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

StopTime.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync('../server/Data/stop_times.json', 'utf8'));
    const chunkSize = 1000;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await StopTime.bulkCreate(chunk);
    }
    console.log('✅ Données insérées dans la table stop_times');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de stop_times :', error);
  }
};

module.exports = StopTime;