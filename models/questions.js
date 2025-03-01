const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const { response } = require('express');

const Question = sequelize.define('Question', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    responseType: {
        type: DataTypes.ENUM('Cursor', 'Text', 'Number'),
        allowNull: false
    },
    positionQuestion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: true });

module.exports = Question;
