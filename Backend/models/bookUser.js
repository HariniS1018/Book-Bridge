import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import Book from "./book.js";
import User from "./user.js";


const BookUser = sequelize.define(
  "BookUser",
  {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
      primaryKey: true,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    available_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0,
      },
    },
    availability_status: {
      type: DataTypes.ENUM("Available", "Lent", "Lost"),
      allowNull: false,
      defaultValue: "Available",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "books_users",
    timestamps: true,
    underscored: true,
  }
);


// Relations
User.belongsToMany(Book, {
  through: BookUser,
  foreignKey: "owner_id",
  otherKey: "book_id",
});

Book.belongsToMany(User, {
  through: BookUser,
  foreignKey: "book_id",
  otherKey: "owner_id",
});

export default BookUser;
