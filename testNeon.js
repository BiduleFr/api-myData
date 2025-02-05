const sequelize = require('./sequelize');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à Neon réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion à Neon :', error);
    }
}

testConnection();
