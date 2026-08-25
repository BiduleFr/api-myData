const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

// modules: { [moduleId]: { enabled, level: 'simple'|'detaille', questions: { [questionId]: { enabled } } } }
const UserPreferences = sequelize.define('UserPreferences', {
  modules: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} }
}, { timestamps: true });

UserPreferences.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(UserPreferences, { foreignKey: 'userId' });

module.exports = UserPreferences;
