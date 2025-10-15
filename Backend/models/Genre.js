import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

const Genre = sequelize.define(
  "Genre",
  {
    genre_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "genres",
    timestamps: true,
    underscored: true,
  }
);

export default Genre;
