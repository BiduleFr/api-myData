const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

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
    }
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // }
}, { timestamps: true });

module.exports = Question;
