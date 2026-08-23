require("dotenv").config();
const { Sequelize } = require('sequelize');

// Utilisez la variable d'environnement DATABASE_URL pour la connexion
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Important pour Neon
        },
    },
});

sequelize.sync({ force: true }).then(() => {
    console.log("Base de données synchronisée !");
});

module.exports = sequelize;

