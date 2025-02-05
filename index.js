require("dotenv").config();
const express = require('express');
const sequelize = require('./sequelize'); // Connexion à la base de données
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());
// Modification

// Définition des routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

console.log('DATABASE_URL:', process.env.DATABASE_URL);



// Test de connexion à la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');

        // Synchronisation des modèles sans écraser les données existantes
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
