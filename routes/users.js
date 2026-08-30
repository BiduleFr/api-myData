const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Récupérer le profil de l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, { attributes: ['id', 'username', 'email'] });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer l\'utilisateur.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || password.length < 8) {
            return res.status(400).json({ error: 'Pseudo et mot de passe de 8 caracteres minimum requis.' });
        }

        // Verifier si le pseudo existe deja
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) return res.status(400).json({ error: 'Ce pseudo est deja utilise.' });

        // Verifier l'email uniquement s'il est fourni (facultatif)
        if (email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) return res.status(400).json({ error: 'Cet email est deja utilise.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creer un nouvel utilisateur
        const newUser = await User.create({ username, email: email || null, password: hashedPassword });

        res.status(201).json({
            message: 'Utilisateur cree avec succes !',
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        console.error('Erreur creation utilisateur:', error.name);
        res.status(500).json({ error: 'Erreur lors de la creation de l\'utilisateur.' });
    }
});


// Connexion par pseudo ou email
router.post('/login', async (req, res) => {
    try {
        const { identifier, email, password } = req.body;
        const searchValue = (identifier || email || '').trim();
        if (!searchValue || !password) {
            return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: searchValue },
                    { email: searchValue }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
        }

        // Générer un token JWT (attention: email peut être null)
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email || null },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie !',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Erreur login:', error.name, error.message);
        res.status(500).json({ error: 'Impossible de se connecter. Veuillez réessayer.' });
    }
});

// Mettre à jour son propre profil
router.put('/me', auth, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        const updates = { username, email };
        if (password) updates.password = await bcrypt.hash(password, 10);
        await user.update(updates);
        res.json({
            message: 'Utilisateur mis à jour avec succès !',
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de mettre à jour l\'utilisateur.' });
    }
});

// Supprimer son propre compte
router.delete('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

        await user.destroy();
        res.json({ message: 'Utilisateur supprimé avec succès !' });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de supprimer l\'utilisateur.' });
    }
});

module.exports = router;
