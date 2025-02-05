const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les utilisateurs.' });
    }
});


// Créer un utilisateur
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'Utilisateur créé avec succès !', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de créer l\'utilisateur.' });
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
