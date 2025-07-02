const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "metropath_database",
  "metropath_database_user",
  "2h1mvSwUJ8dm8lcy6q3sPStZUxY6GugT",
  {
    host: "dpg-d1hqds3uibrs73fo2vkg-a.oregon-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

module.exports = sequelize;