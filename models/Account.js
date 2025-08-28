const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Account = sequelize.define('Account', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  owner: { type: DataTypes.STRING(100), allowNull: false },
  balance: { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0 },
}, { tableName: 'accounts', timestamps: true, version: true });
module.exports = Account;
