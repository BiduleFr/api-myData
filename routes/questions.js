const express = require('express');
const router = express.Router();
const Question = require('../models/question');
require("dotenv").config();

// Récupérer toutes les questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les questions.', details: error.message });
    }
});

// Créer une question
router.post('/', async (req, res) => {
    try {
        const { title, content, responseType, positionQuestion, questionId } = req.body;
        if (!title || !content || !responseType || positionQuestion === undefined || questionId === undefined) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        const newQuestion = await Question.create({ title, content, responseType, positionQuestion, questionId });
        res.status(201).json({ message: 'Question créée avec succès !', question: newQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Impossible de créer la question.', details: error.message });
    }
});

// Modifier une question
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, responseType, positionQuestion, questionId } = req.body;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ error: 'Question non trouvée.' });

        await question.update({ title, content, responseType, positionQuestion, questionId });
        res.json({ message: 'Question mise à jour avec succès !', question });
    } catch (error) {
        res.status(500).json({ error: 'Impossible de mettre à jour la question.', details: error.message });
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
        res.status(500).json({ error: 'Impossible de supprimer la question.', details: error.message });
    }
});

module.exports = router;
