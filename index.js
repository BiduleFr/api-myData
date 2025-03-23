require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS doit être placé en premier
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Test de connexion à la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
        await sequelize.sync({ force: false });
        console.log('Base de données synchronisée.');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
    }
})();

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
