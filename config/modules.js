const fs = require('fs');
const path = require('path');

const modulesPath = path.join(__dirname, '..', 'frontend', 'public', 'modules.schema.json');
const MODULES = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));

module.exports = MODULES;
