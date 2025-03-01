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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true });

module.exports = Question;
