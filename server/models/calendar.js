const fs = require('fs');
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Calendar = sequelize.define('calendar', {
  service_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  monday: DataTypes.INTEGER,
  tuesday: DataTypes.INTEGER,
  wednesday: DataTypes.INTEGER,
  thursday: DataTypes.INTEGER,
  friday: DataTypes.INTEGER,
  saturday: DataTypes.INTEGER,
  sunday: DataTypes.INTEGER,
  start_date: DataTypes.STRING,
  end_date: DataTypes.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

Calendar.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync('../server/Data/calendar.json', 'utf8'));
    await Calendar.bulkCreate(data);
    console.log('✅ Données insérées dans la table calendar');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de calendar :', error);
  }
};

module.exports = Calendar;