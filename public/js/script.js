document.addEventListener("DOMContentLoaded", () => {
    fetchExpenses();
});

const myForm = document.querySelector("#my-form");
const expenseInput = document.querySelector("#expense");
const descriptionInput = document.querySelector("#description");
const categoryInput = document.querySelector("#category");
const expenseList = document.querySelector("#expense-list");

myForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expenseData = {
        amount: expenseInput.value,
        description: descriptionInput.value,
        category: categoryInput.value
    };

    const response = await fetch("/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData)
    });

    if (response.ok) {
        fetchExpenses();
        myForm.reset();
    } else {
        console.error("Failed to add expense");
    }
});

async function fetchExpenses() {
    const response = await fetch("/expenses");
    const expenses = await response.json();

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        const row = document.createElement("tr");
        const messageCell = document.createElement("td");
        messageCell.setAttribute("colspan", "4");
        messageCell.textContent = "No expenses available.";
        row.appendChild(messageCell);
        expenseList.appendChild(row);
        return;
    }

    expenses.forEach((expense) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
                <button class="btn btn-sm btn-warning" onclick="editExpense(${expense.id}, '${expense.amount}', '${expense.description}', '${expense.category}')">Edit</button>
            </td>
        `;
        expenseList.appendChild(row);
    });
}

async function deleteExpense(id) {
    await fetch(`/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
}

function editExpense(id, amount, description, category) {
    expenseInput.value = amount;
    descriptionInput.value = description;
    categoryInput.value = category;

    const originalOnSubmit = myForm.onsubmit;

    myForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedExpense = {
            amount: expenseInput.value,
            description: descriptionInput.value,
            category: categoryInput.value
        };

        const response = await fetch(`/expenses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedExpense)
        });

        if (response.ok) {
            fetchExpenses();
            myForm.reset();
            myForm.onsubmit = originalOnSubmit; 
        } else {
            console.error("Failed to update expense");
        }
    };
}
