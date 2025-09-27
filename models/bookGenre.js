import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";
import Book from "./book.js";

const BookGenre = sequelize.define("BookGenre", {
  book_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Book,
      key: "book_id",
    },
    allowNull:false
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull:false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "book_genres",
  timestamps: false,
});

// Relation
Book.hasMany(BookGenre, { foreignKey: "book_id" });
BookGenre.belongsTo(Book, { foreignKey: "book_id" });

export default BookGenre;
