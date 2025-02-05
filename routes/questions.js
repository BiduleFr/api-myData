const express = require('express');
const router = express.Router();
const Question = require('../models/questions');
require("dotenv").config();
// Assurez-vous d'avoir ce fichier

// Récupérer toutes les questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les questions.' });
    }
});


// Créer une question
router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const newQuestion = await Question.create({ title, content, userId });
        res.status(201).json({ message: 'Question créée avec succès !', question: newQuestion });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de créer la question.' });
    }
});

// Modifier une question
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ error: 'Question non trouvée.' });

        await question.update({ title, content });
        res.json({ message: 'Question mise à jour avec succès !', question });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de mettre à jour la question.' });
    }
});

// Supprimer une question
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ error: 'Question non trouvée.' });

        await question.destroy();
        res.json({ message: 'Question supprimée avec succès !' });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de supprimer la question.' });
    }
});

module.exports = router;
