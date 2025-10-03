import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import Book from "./book.js";
import User from "./user.js";

const BookUser = sequelize.define(
  "BookUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "book_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    availability_status: {
      type: DataTypes.ENUM("Available", "Lent", "Lost"),
      defaultValue: "Available",
      allowNull: false,
    },
  },
  {
    tableName: "books_users",
    timestamps: true,
    underscored: true,
  }
);

// Relations
User.belongsToMany(Book, { through: BookUser, foreignKey: "owner_id" });
Book.belongsToMany(User, { through: BookUser, foreignKey: "book_id" });

export default BookUser;
