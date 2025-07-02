const sequelize = require('./sequelize');
const Agency = require('./models/Agency');
const Route = require('./models/Routes');
const Calendar = require('./models/Calendar');
const CalendarDates = require('./models/Calendar_dates');
const Trip = require('./models/Trips');
const Stop = require('./models/Stop');
const StopTime = require('./models/Stop_times');
const Transfer = require('./models/Transfert');

async function seedAll() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base réussie\n');
    await sequelize.sync({ force: true });
    console.log('📦 Tables créées (ou recréées)');

    await Agency.insertFromJSON();
    await Route.insertRoutesFromJSON();
    await Calendar.insertFromJSON();
    await CalendarDates.insertFromJSON();
    await Trip.insertFromJSON();
    await Stop.insertFromJSON();
    await StopTime.insertFromJSON();
    await Transfer.insertFromJSON();

    console.log('\n✅ Toutes les données ont été insérées avec succès.');
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
  } finally {
    await sequelize.close();
  }
}

seedAll();
