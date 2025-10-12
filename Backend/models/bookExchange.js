import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import User from "./user.js";
import Book from "./book.js";

const BookExchange = sequelize.define(
  "BookExchange",
  {
    borrower_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
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
    lender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Accepted",
        // "Borrowed", // update status while book is borrowed.
        "Rejected",
        "Returned",
        "Overdue"
      ),
      defaultValue: "Pending",
      allowNull: false,
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    borrow_date: {
      type: DataTypes.DATE,
    },
    returned_date: {
      type: DataTypes.DATE,
    },
    due_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "books_exchanged",
    timestamps: true,
    underscored: true,
    validate: {
      preventSelfLending() {
        if (this.lender_id === this.borrower_id) {
          throw new Error("The borrower_id and lender_id must be different. A user cannot borrow a book from themselves.");
        }
      },
    },
});


// Relations
User.hasMany(BookExchange, { as: "BorrowedBooks", foreignKey: "borrower_id" });
User.hasMany(BookExchange, { as: "LentBooks", foreignKey: "lender_id" });

BookExchange.belongsTo(User, { foreignKey: "borrower_id" });
BookExchange.belongsTo(User, { foreignKey: "lender_id" });
BookExchange.belongsTo(Book, { foreignKey: "book_id" });

export default BookExchange;


// use migrations for the below ones: to use custom enum created and SQL constraints (CHECK, UNIQUE)
// await sequelize.query(`
//   ALTER TABLE books_exchanged
//   ADD CONSTRAINT books_exchanged_check
//   CHECK ((borrow_date > request_date) AND (returned_date IS NULL OR returned_date >= borrow_date) AND (due_date IS NULL OR due_date >= borrow_date))
// `);
