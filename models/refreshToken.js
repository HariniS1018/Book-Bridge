import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";
import User from "./user.js";

const RefreshToken = sequelize.define("RefreshToken", {
  token: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  expires_at: {
    type: DataTypes.DATE,
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "refresh_tokens",
  timestamps: false,
});

// Association
User.hasMany(RefreshToken, { foreignKey: "user_id" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

export default RefreshToken;
