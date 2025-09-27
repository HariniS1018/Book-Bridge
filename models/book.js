import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";

const Book = sequelize.define("Book", {
  book_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
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
    allowNull:true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "books",
  timestamps: false,
});

export default Book;
