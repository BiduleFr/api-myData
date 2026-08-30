const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const DailyEntry = sequelize.define('DailyEntry', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  answers: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  journalEntry: { type: DataTypes.TEXT, allowNull: true },
  answerStates: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  moduleScores: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  globalScore: { type: DataTypes.FLOAT, allowNull: true },
  completionStatus: {
    type: DataTypes.ENUM('draft', 'complete'),
    allowNull: false,
    defaultValue: 'draft'
  }
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'date'] }]
});

DailyEntry.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(DailyEntry, { foreignKey: 'userId' });

module.exports = DailyEntry;
