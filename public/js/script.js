document.addEventListener("DOMContentLoaded", () => {
    checkAuth(); // Ensure user is logged in
    fetchExpenses();
});

const myForm = document.querySelector("#my-form");
const expenseInput = document.querySelector("#expense");
const descriptionInput = document.querySelector("#description");
const categoryInput = document.querySelector("#category");
const expenseList = document.querySelector("#expense-list");
const messageBox = document.querySelector("#message-box");

let editingExpenseId = null;

// ✅ Get Token from Local Storage
function getToken() {
    return localStorage.getItem("token");
}

// ✅ Redirect to login if token is missing
function checkAuth() {
    if (!getToken()) {
        window.location.href = "/";
    }
}

// ✅ Logout function
function logout() {
    localStorage.removeItem("token"); // Remove token
    window.location.href = "/"; // Redirect to login page
}

// ✅ Fetch expenses from API
async function fetchExpenses() {
    const response = await fetch("/expenses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        showMessage("Failed to fetch expenses!", "error");
        return;
    }

    const expenses = await response.json();
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = `<tr><td colspan="4">No expenses available.</td></tr>`;
        return;
    }

    expenses.forEach((expense) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="loadExpenseForEdit(${expense.id}, '${expense.amount}', '${expense.description}', '${expense.category}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });
}

// ✅ Handle Form Submission (Add/Edit Expense)
myForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expenseData = {
        amount: expenseInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: categoryInput.value
    };

    if (!expenseData.amount || !expenseData.description || !expenseData.category) {
        showMessage("All fields are required!", "error");
        return;
    }

    const url = editingExpenseId ? `/expenses/${editingExpenseId}` : "/expenses";
    const method = editingExpenseId ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(expenseData)
    });

    if (response.ok) {
        fetchExpenses();
        myForm.reset();
        showMessage(editingExpenseId ? "Expense updated successfully!" : "Expense added successfully!", "success");
        editingExpenseId = null;
    } else {
        showMessage("Failed to process request!", "error");
    }
});

// ✅ Delete Expense
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const response = await fetch(`/expenses/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });

    if (response.ok) {
        fetchExpenses();
        showMessage("Expense deleted successfully!", "success");
    } else {
        showMessage("Failed to delete expense!", "error");
    }
}

// ✅ Load Expense Data for Editing
function loadExpenseForEdit(id, amount, description, category) {
    expenseInput.value = amount;
    descriptionInput.value = description;
    categoryInput.value = category;
    editingExpenseId = id;
}

// ✅ Show Messages to User
function showMessage(message, type) {
    messageBox.innerHTML = `<div class="${type === "success" ? "alert alert-success" : "alert alert-danger"}">${message}</div>`;
    setTimeout(() => {
        messageBox.innerHTML = "";
    }, 3000);
}
