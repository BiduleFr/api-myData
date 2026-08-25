require("dotenv").config();
const dns = require('dns');
const { Sequelize } = require('sequelize');

// Certains environnements de dev n'ont pas de route IPv6 vers Supabase.
dns.setDefaultResultOrder('ipv4first');

const databaseUrl = process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL ou DATABASE_URL_POOLER est requis.');
}

// Utilisez la variable d'environnement DATABASE_URL pour la connexion
const sequelize = new Sequelize(databaseUrl, {
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

