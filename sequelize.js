require("dotenv").config();
const dns = require('dns');
const { Sequelize } = require('sequelize');

// Certains environnements de dev n'ont pas de route IPv6 vers Supabase.
dns.setDefaultResultOrder('ipv4first');

const databaseUrl = process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL ou DATABASE_URL_POOLER est requis.');
}

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL_POOLER) {
    throw new Error('DATABASE_URL_POOLER est obligatoire en production. Copiez la chaîne Connection Pooling de Supabase dans Render.');
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

if (process.env.NODE_ENV === 'production' && parsedDatabaseUrl.hostname.startsWith('db.') && parsedDatabaseUrl.port === '5432') {
    throw new Error('Endpoint Supabase direct détecté en production. Utilisez le host pooler Supabase et le port 6543 dans DATABASE_URL_POOLER.');
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

