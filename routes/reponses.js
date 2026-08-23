const express = require('express');
const router = express.Router();
const Reponse = require('../models/reponses');
const Question = require('../models/questions');
require("dotenv").config();

// Récupérer toutes les réponses d'un utilisateur (pour les statistiques)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reponses = await Reponse.findAll({
            where: { userId },
            include: [{ model: Question }],
            order: [['date', 'ASC']]
        });
        res.json(reponses);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les réponses.', details: error.message });
    }
});

// Récupérer les réponses d'un utilisateur pour une date donnée
router.get('/user/:userId/date/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const reponses = await Reponse.findAll({
            where: { userId, date },
            include: [{ model: Question }]
        });
        res.json(reponses);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les réponses.', details: error.message });
    }
});

// Enregistrer les réponses du jour (tableau de réponses)
router.post('/', async (req, res) => {
    try {
        const { userId, date, reponses } = req.body;
        if (!userId || !date || !Array.isArray(reponses)) {
            return res.status(400).json({ error: 'userId, date et reponses (tableau) sont requis.' });
        }

        const results = await Promise.all(reponses.map(async ({ questionId, value }) => {
            const [reponse, created] = await Reponse.findOrCreate({
                where: { userId, questionId, date },
                defaults: { value }
            });
            if (!created) {
                await reponse.update({ value });
            }
            return reponse;
        }));

        res.status(201).json({ message: 'Réponses enregistrées avec succès !', reponses: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Impossible d\'enregistrer les réponses.', details: error.message });
    }
});

// Supprimer une réponse
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reponse = await Reponse.findByPk(id);
        if (!reponse) return res.status(404).json({ error: 'Réponse non trouvée.' });

        await reponse.destroy();
        res.json({ message: 'Réponse supprimée avec succès !' });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de supprimer la réponse.', details: error.message });
    }
});

module.exports = router;
