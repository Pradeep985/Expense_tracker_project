const Expense = require("../models/expenseModel");

exports.getExpenses = (req, res) => {
  Expense.getAllExpenses((err, expenses) => {
    if (err) return res.status(500).send(err);
    res.json(expenses);
  });
};

exports.addExpense = (req, res) => {
  const { amount, description, category } = req.body;
  Expense.createExpense(amount, description, category, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, amount, description, category });
  });
};

exports.deleteExpense = (req, res) => {
  Expense.deleteExpense(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Expense deleted");
  });
};

exports.updateExpense = (req, res) => {
  const { amount, description, category } = req.body;
  Expense.updateExpense(req.params.id, amount, description, category, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Expense updated successfully");
  });
};
