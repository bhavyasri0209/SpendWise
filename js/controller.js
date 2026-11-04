import {
    getExpenses,
    addExpense,
    editExpense,
    removeExpense
} from "./service/transactions.js";

import { validateExpense } from "../exception/validator.js";


let expenses = [];
let editId = null;


const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const saveButton = document.getElementById("saveButton");
const expenseList = document.getElementById("expenseList");

const totalExpense = document.getElementById("totalExpense");
const expenseCount = document.getElementById("expenseCount");

const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");


async function loadExpenses() {

    const response = await getExpenses();

    expenses = response.data;

    displayExpenses(expenses);
}


function displayExpenses(list) {

    expenseList.innerHTML = "";

    let total = 0;

    list.forEach(expense => {

        total += Number(expense.amount);

        expenseList.innerHTML += `
            <div class="expense">

                <div>
                    <h3>${expense.title}</h3>
                    <p>${expense.category} | ${expense.date}</p>
                </div>

                <div>
                    <span class="amount">₹${expense.amount}</span>

                    <button class="edit"
                        onclick="editItem('${expense.id}')">
                        Edit
                    </button>

                    <button class="delete"
                        onclick="deleteItem('${expense.id}')">
                        Delete
                    </button>
                </div>

            </div>
        `;
    });

    totalExpense.textContent = `₹${total}`;
    expenseCount.textContent = list.length;
}


saveButton.addEventListener("click", async function () {

    if (!validateExpense(
        title.value,
        amount.value,
        category.value,
        date.value
    )) {
        return;
    }

    const expense = {
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };

    if (editId === null) {

        await addExpense(expense);

    } else {

        await editExpense(editId, expense);

        editId = null;
        saveButton.textContent = "Add Expense";
    }

    clearForm();

    loadExpenses();
});


function clearForm() {

    title.value = "";
    amount.value = "";
    category.value = "";
    date.value = "";
}


window.editItem = function(id) {

    const expense = expenses.find(item => item.id == id);

    title.value = expense.title;
    amount.value = expense.amount;
    category.value = expense.category;
    date.value = expense.date;

    editId = id;

    saveButton.textContent = "Update Expense";
};


window.deleteItem = async function(id) {

    if (confirm("Delete this expense?")) {

        await removeExpense(id);

        loadExpenses();
    }
};


function filterExpenses() {

    let result = expenses;

    if (search.value !== "") {

        result = result.filter(expense =>
            expense.title
                .toLowerCase()
                .includes(search.value.toLowerCase())
        );
    }

    if (filterCategory.value !== "") {

        result = result.filter(expense =>
            expense.category === filterCategory.value
        );
    }

    displayExpenses(result);
}


search.addEventListener("input", filterExpenses);

filterCategory.addEventListener("change", filterExpenses);


loadExpenses();