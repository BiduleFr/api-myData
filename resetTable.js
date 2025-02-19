const { Sequelize, DataTypes } = require("sequelize");

// Remplacez par votre URL de connexion Railway
const sequelize = new Sequelize("postgresql://neondb_owner:npg_kB7fGZV6yzUr@ep-wispy-wildflower-a9965hiq-pooler.gwc.azure.neon.tech/neondb?sslmode=require");

// Définition du modèle (assurez-vous qu'il correspond à votre base)
const Question = sequelize.define("Question", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

async function resetTable() {
    try {
        await sequelize.authenticate();
        console.log("Connexion réussie à la base de données.");

        // Supprimer et recréer la table
        await Question.sync({ force: true });
        console.log("Table `Questions` supprimée et recréée avec succès.");

        await sequelize.close();
    } catch (error) {
        console.error("Erreur :", error);
    }
}

resetTable();
