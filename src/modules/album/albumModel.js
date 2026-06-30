import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Album = sequelize.define(
  'Album',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  },
  { tableName: 'albums', timestamps: true }
);

export default Album;
