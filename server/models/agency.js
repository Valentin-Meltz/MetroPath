const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const fs = require('fs');

const Agency = sequelize.define('agency', {
  agency_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  agency_name: DataTypes.STRING,
  agency_url: DataTypes.STRING,
  agency_timezone: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Agency.insertFromJSON = async function () {
  try {
    const agencies = JSON.parse(fs.readFileSync('../server/Data/agency.json', 'utf8'));
    await Agency.bulkCreate(agencies);
    console.log('✅ Données insérées dans la table agency');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des agences :', error);
  }
};

module.exports = Agency;