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
    logging: false
});

// La synchronisation est déclenchée une seule fois au démarrage du serveur (voir index.js).
module.exports = sequelize;

