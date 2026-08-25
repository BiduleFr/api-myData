const express = require('express');
const router = express.Router();
const MODULES = require('../config/modules');

// Configuration publique des modules/questions (pas de données personnelles).
router.get('/', (req, res) => {
  res.json({ modules: MODULES });
});

module.exports = router;
