import { DataTypes } from "sequelize";
import sequelize from "../init/db.js";
import User from "./user.js";
import Book from "./book.js";

const BookExchange = sequelize.define("BookExchange", {
  exchange_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull:false
  },
  status: {
    type: DataTypes.ENUM("Pending", "Accepted", "Rejected", "Returned", "Overdue"),
    defaultValue: "Pending",
    allowNull:false
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "books_exchanged",
  timestamps: false,
});

// Relations
User.hasMany(BookExchange, { as: "BorrowedBooks", foreignKey: "borrower_id" });
User.hasMany(BookExchange, { as: "LentBooks", foreignKey: "lender_id" });

BookExchange.belongsTo(User, { as: "Borrower", foreignKey: "borrower_id" });
BookExchange.belongsTo(User, { as: "Lender", foreignKey: "lender_id" });
BookExchange.belongsTo(Book, { foreignKey: "book_id" });

export default BookExchange;
