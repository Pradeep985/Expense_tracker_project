const db = require("../config/db");

exports.getAllExpenses = (callback) => {
  db.query("SELECT * FROM expenses", callback);
};

exports.createExpense = (amount, description, category, callback) => {
  db.query(
    "INSERT INTO expenses (amount, description, category) VALUES (?, ?, ?)",
    [amount, description, category],
    callback
  );
};

exports.deleteExpense = (id, callback) => {
  db.query("DELETE FROM expenses WHERE id = ?", [id], callback);
};

exports.getExpenseById = (id, callback) => {
  db.query("SELECT * FROM expenses WHERE id = ?", [id], callback);
};

exports.updateExpense = (id, amount, description, category, callback) => {
  db.query(
    "UPDATE expenses SET amount = ?, description = ?, category = ? WHERE id = ?",
    [amount, description, category, id],
    callback
  );
};
