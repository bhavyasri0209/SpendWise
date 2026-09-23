import {
    getData,
    addData,
    updateData,
    deleteData
} from "./connection.js";

export function getExpenses() {
    return getData();
}

export function addExpense(expense) {
    return addData(expense);
}

export function editExpense(id, expense) {
    return updateData(id, expense);
}

export function removeExpense(id) {
    return deleteData(id);
}