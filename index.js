require("dotenv").config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = require('./sequelize');

// CORS doit être placé en premier
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

// Limite le nombre de requêtes par IP pour éviter les abus.
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

const userRoutes = require('./routes/users');
const configRoutes = require('./routes/config');
const preferencesRoutes = require('./routes/preferences');
const entriesRoutes = require('./routes/entries');

app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/entries', entriesRoutes);

// Charge les modèles pour que Sequelize connaisse toutes les tables avant la synchronisation.
require('./models/user');
require('./models/userPreferences');
require('./models/dailyEntry');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
        await sequelize.sync({ alter: false });
        console.log('Base de données synchronisée.');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
    }
})();

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
