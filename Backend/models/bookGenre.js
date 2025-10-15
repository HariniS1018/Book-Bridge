import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import Book from "./book.js";
import Genre from "./Genre.js";

const BookGenre = sequelize.define(
  "BookGenre",
  {
    book_id: { type: DataTypes.INTEGER, allowNull: false },
    genre_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "book_genres",
    timestamps: true,
    underscored: true,
  }
);

// Relations
Book.belongsToMany(Genre, { through: BookGenre, foreignKey: "book_id" });
Genre.belongsToMany(Book, { through: BookGenre, foreignKey: "genre_id" });

export default BookGenre;
