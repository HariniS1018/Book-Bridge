import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";
import Book from "./book.js";
import User from "./user.js";

const BookUser = sequelize.define("BookUser", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  availability_status: {
    type: DataTypes.ENUM("Available", "Lent", "Lost"),
    defaultValue: "Available",
    allowNull:false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "books_users",
  timestamps: false,
});

// Relations
User.belongsToMany(Book, { through: BookUser, foreignKey: "owner_id" });
Book.belongsToMany(User, { through: BookUser, foreignKey: "book_id" });

export default BookUser;
