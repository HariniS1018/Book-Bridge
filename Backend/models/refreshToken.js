import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import User from "./user.js";

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
  }
);

// Association
User.hasMany(RefreshToken, { foreignKey: "user_id" }); // one-to-many
RefreshToken.belongsTo(User, { foreignKey: "user_id" }); // many-to-one

export default RefreshToken;
