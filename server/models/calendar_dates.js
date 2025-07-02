const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const fs = require('fs');

const CalendarDates = sequelize.define('calendar_dates', {
  service_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  date: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  exception_type: DataTypes.INTEGER,
}, {
  timestamps: false,
  freezeTableName: true,
});

CalendarDates.insertFromJSON = async function () {
  try {
    const data = JSON.parse(fs.readFileSync('../server/Data/calendar_dates.json', 'utf8'));
    await CalendarDates.bulkCreate(data);
    console.log('✅ Données insérées dans la table calendar_dates');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion de calendar_dates :', error);
  }
};

module.exports = CalendarDates;