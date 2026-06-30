import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  albumId: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'photos',
  timestamps: true,
});

export default Photo;