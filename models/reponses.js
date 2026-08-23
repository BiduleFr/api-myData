const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');
const Question = require('./questions');

const Reponse = sequelize.define('Reponse', {
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: true });

Reponse.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Reponse, { foreignKey: 'userId' });

Reponse.belongsTo(Question, { foreignKey: 'questionId', onDelete: 'CASCADE' });
Question.hasMany(Reponse, { foreignKey: 'questionId' });

module.exports = Reponse;
