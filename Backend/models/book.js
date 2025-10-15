import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    book_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    publication_year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    isbn: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
  },
  {
    tableName: "books",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "idx_books_author_name",
        fields: ["author_name"],
      },
      {
        name: "idx_books_book_name",
        fields: ["book_name"],
      },
    ],
  }
);


export default Book;


// use migrations for the below ones: Advanced indexes (ASC, NULLS) and SQL constraints (CHECK, UNIQUE)
// await sequelize.query(`
//   ALTER TABLE books
//   ADD CONSTRAINT books_publication_year_check
//   CHECK (publication_year > 0)
// `);
// await sequelize.query(`
//   CREATE INDEX IF NOT EXISTS idx_books_author_name
//   ON books (author_name ASC NULLS LAST)
// `);
