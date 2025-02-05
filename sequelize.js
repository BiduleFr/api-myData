require("dotenv").config();
const { Sequelize } = require('sequelize');

console.log('Database URL:', process.env.DATABASE_URL);
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

module.exports = sequelize;

