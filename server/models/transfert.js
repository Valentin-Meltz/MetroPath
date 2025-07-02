const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Transfer = sequelize.define('transfers', {
  from_stop_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  to_stop_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  transfer_type: DataTypes.STRING,
  min_transfer_time: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Transfer.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync('../server/Data/transfers.json', 'utf8'));
    await Transfer.bulkCreate(data);
    console.log('✅ Données insérées dans la table transfers');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de transfers :', error);
  }
};

module.exports = Transfer;