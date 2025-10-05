import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";


const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    registration_number: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        "admin",
        "student"
      ),
      defaultValue: "student",
      allowNull: false,
    },
    email_id: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
