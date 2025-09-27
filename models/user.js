import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "users",
  timestamps: false,
});

export default User;
