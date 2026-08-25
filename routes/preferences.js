const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserPreferences = require('../models/userPreferences');

router.get('/', auth, async (req, res) => {
  try {
    let prefs = await UserPreferences.findOne({ where: { userId: req.userId } });
    if (!prefs) prefs = await UserPreferences.create({ userId: req.userId, modules: {} });
    res.json({ modules: prefs.modules });
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les préférences.', details: error.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { modules } = req.body;
    if (!modules || typeof modules !== 'object') {
      return res.status(400).json({ error: 'modules (objet) est requis.' });
    }
    let prefs = await UserPreferences.findOne({ where: { userId: req.userId } });
    if (!prefs) {
      prefs = await UserPreferences.create({ userId: req.userId, modules });
    } else {
      await prefs.update({ modules });
    }
    res.json({ modules: prefs.modules });
  } catch (error) {
    res.status(500).json({ error: 'Impossible d\'enregistrer les préférences.', details: error.message });
  }
});

module.exports = router;
