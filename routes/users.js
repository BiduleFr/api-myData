const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les utilisateurs.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Mot de passe incorrect.' });

        // Supprimer la génération du token et renvoyer seulement l'utilisateur
        res.json({ message: 'Connexion réussie !', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Impossible de se connecter.' });
    }
});


// Créer un utilisateur
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Mot de passe incorrect.' });

        // Générer un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, 'VOTRE_CLE_SECRETE', { expiresIn: '24h' });

        res.json({ message: 'Connexion réussie !', token, user });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de se connecter.' });
    }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        await user.update({ username, email, password });
        res.json({ message: 'Utilisateur mis à jour avec succès !', user });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de mettre à jour l\'utilisateur.' });
    }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        await user.destroy();
        res.json({ message: 'Utilisateur supprimé avec succès !' });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de supprimer l\'utilisateur.' });
    }
});

module.exports = router;
