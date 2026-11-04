import API_BASE_URL from "./apiConfig.js";

// ===============================
// USER APIs
// ===============================

export async function getUsers() {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
}

export async function createUser(userData) {
    const response = await axios.post(
        `${API_BASE_URL}/users`,
        userData
    );

    return response.data;
}


// ===============================
// EXPENSE APIs
// ===============================

export async function getExpenses(userId) {
    const response = await axios.get(
        `${API_BASE_URL}/expenses?userId=${userId}`
    );

    return response.data;
}

export async function addExpense(expenseData) {
    const response = await axios.post(
        `${API_BASE_URL}/expenses`,
        expenseData
    );

    return response.data;
}

export async function updateExpense(expenseId, expenseData) {
    const response = await axios.put(
        `${API_BASE_URL}/expenses/${expenseId}`,
        expenseData
    );

    return response.data;
}

export async function deleteExpense(expenseId) {
    const response = await axios.delete(
        `${API_BASE_URL}/expenses/${expenseId}`
    );

    return response.data;
}


// ===============================
// BUDGET APIs
// ===============================

export async function getBudget(userId) {
    const response = await axios.get(
        `${API_BASE_URL}/budgets?userId=${userId}`
    );

    return response.data;
}

export async function updateBudget(budgetId, budgetData) {
    const response = await axios.put(
        `${API_BASE_URL}/budgets/${budgetId}`,
        budgetData
    );

    return response.data;
}


// ===============================
// CATEGORY LIMIT APIs
// ===============================

export async function getCategoryLimits(userId) {
    const response = await axios.get(
        `${API_BASE_URL}/categoryLimits?userId=${userId}`
    );

    return response.data;
}

export async function updateCategoryLimit(
    limitId,
    limitData
) {
    const response = await axios.put(
        `${API_BASE_URL}/categoryLimits/${limitId}`,
        limitData
    );

    return response.data;
}


// ===============================
// SAVINGS GOAL APIs
// ===============================

export async function getSavingsGoals(userId) {
    const response = await axios.get(
        `${API_BASE_URL}/savingsGoals?userId=${userId}`
    );

    return response.data;
}

export async function addSavingsGoal(goalData) {
    const response = await axios.post(
        `${API_BASE_URL}/savingsGoals`,
        goalData
    );

    return response.data;
}

export async function updateSavingsGoal(goalId, goalData) {
    const response = await axios.patch(`${API_BASE_URL}/savingsGoals/${goalId}`, goalData);
    return response.data;
}

export async function deleteSavingsGoal(goalId) {
    const response = await axios.delete(
        `${API_BASE_URL}/savingsGoals/${goalId}`
    );

    return response.data;
}