require("dotenv").config();
const dns = require('dns');
const { Sequelize } = require('sequelize');

// Certains environnements de dev n'ont pas de route IPv6 vers Supabase.
dns.setDefaultResultOrder('ipv4first');

const databaseUrl = process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL ou DATABASE_URL_POOLER est requis.');
}

let parsedDatabaseUrl;
try {
    parsedDatabaseUrl = new URL(databaseUrl);
} catch {
    throw new Error('La variable DB doit être une URL PostgreSQL valide.');
}

if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error('DATABASE_URL_POOLER doit être la chaîne PostgreSQL Supabase, pas une URL https:// de Render.');
}

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: parsedDatabaseUrl.hostname,
    port: Number(parsedDatabaseUrl.port || 5432),
    database: parsedDatabaseUrl.pathname.replace(/^\//, '') || 'postgres',
    username: decodeURIComponent(parsedDatabaseUrl.username),
    password: decodeURIComponent(parsedDatabaseUrl.password),
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

