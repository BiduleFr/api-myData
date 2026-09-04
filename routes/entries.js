const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const DailyEntry = require('../models/dailyEntry');
const UserPreferences = require('../models/userPreferences');
const MODULES = require('../config/modules');
const { computeScores } = require('../utils/scoring');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Historique (pour les statistiques)
router.get('/', auth, async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const where = { userId: req.userId };
    if (from || to) {
      where.date = {};
      if (from) where.date[Op.gte] = from;
      if (to) where.date[Op.lte] = to;
    }
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    // Avec une limite et sans borne explicite, on veut les N journées les plus
    // récentes : on trie en DESC pour appliquer la limite, puis on remet en ASC.
    const entries = await DailyEntry.findAll({
      where,
      order: [['date', parsedLimit ? 'DESC' : 'ASC']],
      limit: parsedLimit
    });
    if (parsedLimit) entries.reverse();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer l\'historique.', details: error.message });
  }
});

// Entrée d'une date précise
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const entry = await DailyEntry.findOne({ where: { userId: req.userId, date } });
    res.json(entry || {
      date,
      answers: {},
      answerStates: {},
      journalEntry: '',
      moduleScores: {},
      globalScore: null,
      completionStatus: 'not_started'
    });
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer la journée.', details: error.message });
  }
});

// Créer / mettre à jour l'entrée du jour (brouillon auto-sauvegardé ou complète)
router.post('/', auth, async (req, res) => {
  try {
    const { date = todayISO(), answers = {}, journalEntry, answerStates = {}, completionStatus = 'draft' } = req.body;
    if (typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers doit être un objet.' });
    }

    const prefs = await UserPreferences.findOne({ where: { userId: req.userId } });
    let entry = await DailyEntry.findOne({ where: { userId: req.userId, date } });
    const mergedAnswers = { ...(entry?.answers || {}), ...answers };
    const mergedAnswerStates = { ...(entry?.answerStates || {}), ...answerStates };
    const { globalScore, moduleScores } = computeScores(MODULES, prefs?.modules || {}, mergedAnswers);

    if (!entry) {
      entry = await DailyEntry.create({
        userId: req.userId, date, answers: mergedAnswers, answerStates: mergedAnswerStates,
        journalEntry: journalEntry ?? null, moduleScores, globalScore, completionStatus
      });
    } else {
      await entry.update({
        answers: mergedAnswers,
        answerStates: mergedAnswerStates,
        ...(journalEntry !== undefined ? { journalEntry } : {}),
        moduleScores,
        globalScore,
        completionStatus
      });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Impossible d\'enregistrer la journée.', details: error.message });
  }
});

module.exports = router;
