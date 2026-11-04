import {
    getUsers,
    createUser,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getBudget,
    updateBudget,
    getCategoryLimits,
    getSavingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal
} from "./service/expenseService.js";
// =====================================
// ANALYTICS CHART INSTANCES
// =====================================

let expensePieChart = null;
let monthlyExpenseChart = null;
let savingsChart = null;
// =========================================
// LOAD DASHBOARD DATA
// =========================================

async function loadDashboard(user) {
    // Update Settings profile
document.getElementById("settingsName").textContent =
    user.name;

document.getElementById("settingsEmail").textContent =
    user.email;

document.getElementById("settingsNameValue").textContent =
    user.name;

document.getElementById("settingsEmailValue").textContent =
    user.email;

document.getElementById("settingsAvatar").textContent =
    user.name.charAt(0).toUpperCase();

    try {

        const expenses =
            await getExpenses(user.id);

        const budgetData =
            await getBudget(user.id);

        const categoryLimits =
            await getCategoryLimits(user.id);

        const savingsGoals =
            await getSavingsGoals(user.id);
            
// =====================================
// DISPLAY RECENT EXPENSES
// =====================================

const recentExpensesTable =
    document.getElementById("recentExpensesTable");

const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

recentExpensesTable.innerHTML = "";

if (recentExpenses.length === 0) {
    recentExpensesTable.innerHTML = `
        <tr>
            <td colspan="4">
                No expenses available.
            </td>
        </tr>
    `;
} else {
    recentExpenses.forEach((expense) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${expense.category}</td>
            <td>₹${Number(expense.amount).toLocaleString("en-IN")}</td>
            <td>${expense.date}</td>
        `;

        recentExpensesTable.appendChild(row);
    });
}



        // =====================================
        // CURRENT DATE
        // =====================================

        const today = new Date();

        const currentMonth =
            today.getMonth();

        const currentYear =
            today.getFullYear();


        // =====================================
        // CURRENT MONTH EXPENSES
        // =====================================

        const monthlyExpenses =
            expenses.filter((expense) => {

                const expenseDate =
                    new Date(expense.date);

                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );

            });


        // =====================================
        // TOTAL MONTHLY SPENDING
        // =====================================

        const totalSpent =
            monthlyExpenses.reduce(
                (total, expense) =>
                    total + Number(expense.amount),
                0
            );


        // =====================================
        // MONTHLY BUDGET
        // =====================================

        const monthlyBudget =
            budgetData.length > 0
                ? Number(budgetData[0].monthlyLimit)
                : 0;


        // =====================================
        // REMAINING BUDGET
        // =====================================

        const remainingBudget =
            monthlyBudget - totalSpent;


        // =====================================
        // THIS WEEK
        // =====================================

        const sevenDaysAgo =
            new Date();

        sevenDaysAgo.setDate(
            today.getDate() - 6
        );

        sevenDaysAgo.setHours(
            0, 0, 0, 0
        );


        const weeklyExpenses =
            expenses.filter((expense) => {

                const expenseDate =
                    new Date(expense.date);

                return expenseDate >= sevenDaysAgo;

            });


        const weeklySpent =
            weeklyExpenses.reduce(
                (total, expense) =>
                    total + Number(expense.amount),
                0
            );
        // =====================================
// CATEGORY SPENDING
// =====================================

const categoryTotals = {};

monthlyExpenses.forEach((expense) => {

    const category = expense.category;

    if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
    }

    categoryTotals[category] +=
        Number(expense.amount);

});

console.log(
    "Category Totals:",
    categoryTotals
);
// Display Category Spending Limits
const limitsContainer =
    document.getElementById("categoryLimits");

limitsContainer.innerHTML = "";

categoryLimits.forEach((limit) => {
    const spent = categoryTotals[limit.category] || 0;
    const limitAmount = Number(limit.limit);

    const percentage =
        limitAmount > 0
            ? (spent / limitAmount) * 100
            : 0;

// =====================================
// CATEGORY LIMIT STATUS
// =====================================

let status = "Within Limit";

let statusClass = "within-limit";

if (percentage >= 100) {
    status = "Limit Exceeded";
    statusClass = "limit-exceeded";
} else if (percentage >= 80) {
    status = "Near Limit";
    statusClass = "near-limit";
}
    const limitItem = document.createElement("div");

    limitItem.className = "limit-item";

    limitItem.innerHTML = `
        <div class="limit-item-header">
            <span>${limit.category}</span>
            <strong>
                ₹${spent.toLocaleString("en-IN")}
                / ₹${limitAmount.toLocaleString("en-IN")}
            </strong>
        </div>

        <div class="limit-progress">
            <div
                class="limit-progress-bar"
                style="width: ${Math.min(percentage, 100)}%"
            ></div>
        </div>
<small>
    ${percentage.toFixed(1)}% used
</small>

<div class="limit-status ${statusClass}">
    ${status}
</div>
    `;

    limitsContainer.appendChild(limitItem);
});
// =====================================
// DISPLAY SAVINGS GOALS
// =====================================

const goalsContainer =
    document.getElementById("savingsGoals");

goalsContainer.innerHTML = "";

if (savingsGoals.length === 0) {
    goalsContainer.innerHTML = `
        <p class="empty-message">
            No savings goals yet.
        </p>
    `;
} else {
    savingsGoals.forEach((goal) => {

        const targetAmount = Number(goal.targetAmount);
        const savedAmount = Number(goal.savedAmount);

        const percentage =
            targetAmount > 0
                ? (savedAmount / targetAmount) * 100
                : 0;
let goalStatus = "On Track";
let goalStatusClass = "goal-on-track";

if (percentage >= 100) {
    goalStatus = "Goal Completed";
    goalStatusClass = "goal-completed";
} else if (percentage >= 80) {
    goalStatus = "Almost There";
    goalStatusClass = "goal-almost";
}
        const goalItem = document.createElement("div");

        goalItem.className = "goal-item";

        goalItem.innerHTML = `
            <div class="goal-header">
                <div>
                    <h3>${goal.name}</h3>
                    <p>${goal.description || ""}</p>
                </div>

                <strong>
                    ${percentage.toFixed(0)}%
                </strong>
            </div>

            <div class="goal-amount">
                ₹${savedAmount.toLocaleString("en-IN")}
                / ₹${targetAmount.toLocaleString("en-IN")}
            </div>

            <div class="goal-progress">
                <div
                    class="dashboard-goal-progress-fill"
                    style="width: ${Math.min(percentage, 100)}%"
                ></div>
            </div>

         <small>
    Target date: ${goal.targetDate}
</small>

<div class="goal-status ${goalStatusClass}">
    ${goalStatus}
</div>
        `;

        goalsContainer.appendChild(goalItem);
    });
}
// =====================================
// DISPLAY CATEGORY SPENDING
// =====================================

const categorySpending =
    document.getElementById("categorySpending");

categorySpending.innerHTML = "";

Object.entries(categoryTotals).forEach(
    ([category, amount]) => {

        const percentage =
            totalSpent > 0
                ? (amount / totalSpent) * 100
                : 0;

        const categoryItem =
            document.createElement("div");

        categoryItem.className =
            "category-item";

        categoryItem.innerHTML = `
            <div class="category-item-header">
                <span>${category}</span>
                <strong>₹${amount.toLocaleString("en-IN")}</strong>
            </div>

            <div class="category-progress">
                <div
                    class="category-progress-bar"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <small>
                ${percentage.toFixed(1)}% of total spending
            </small>
        `;

        categorySpending.appendChild(
            categoryItem
        );

    }
);
// =====================================
// ANALYTICS
// =====================================

const analyticsTotalSpent =
    document.getElementById("analyticsTotalSpent");

const analyticsTopCategory =
    document.getElementById("analyticsTopCategory");

const analyticsExpenseCount =
    document.getElementById("analyticsExpenseCount");

const analyticsCategoryList =
    document.getElementById("analyticsCategoryList");


// Total spending

analyticsTotalSpent.textContent =
    `₹${totalSpent.toLocaleString("en-IN")}`;


// Number of expenses

analyticsExpenseCount.textContent =
    monthlyExpenses.length;


// Highest spending category

let topCategory = "-";
let highestAmount = 0;

Object.entries(categoryTotals).forEach(
    ([category, amount]) => {

        if (amount > highestAmount) {
            highestAmount = amount;
            topCategory = category;
        }

    }
);

analyticsTopCategory.textContent =
    topCategory;


// Category-wise analytics

analyticsCategoryList.innerHTML = "";

Object.entries(categoryTotals).forEach(
    ([category, amount]) => {

        const percentage =
            totalSpent > 0
                ? (amount / totalSpent) * 100
                : 0;

        const item =
            document.createElement("div");

        item.className =
            "analytics-category-item";

        item.innerHTML = `
            <div class="analytics-category-header">
                <span>${category}</span>

                <strong>
                    ₹${amount.toLocaleString("en-IN")}
                </strong>
            </div>

            <div class="analytics-progress">
                <div
                    class="analytics-progress-bar"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <small>
                ${percentage.toFixed(1)}%
            </small>
        `;

        analyticsCategoryList.appendChild(item);

    }
);

// =====================================
// EXPENSE PIE CHART
// =====================================

const pieCanvas = document.getElementById("expensePieChart");

if (expensePieChart) {
    expensePieChart.destroy();
}

expensePieChart = new Chart(pieCanvas, {
    type: "doughnut",

    data: {
        labels: Object.keys(categoryTotals),

        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: [
                "#6366f1",
                "#06b6d4",
                "#f59e0b",
                "#ec4899",
                "#10b981",
                "#8b5cf6",
                "#f97316",
                "#14b8a6",
                "#64748b"
            ],
            borderWidth: 2,
            borderColor: "#171b29"
        }]
    },

    options: {
        responsive: true,
        
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#cbd5e1"
                }
            }
        }
    }
});


// =====================================
// MONTHLY SPENDING BAR CHART
// =====================================

const monthlyLabels = [];
const monthlyAmounts = [];

for (let i = 5; i >= 0; i--) {

    const monthDate = new Date(
        currentYear,
        currentMonth - i,
        1
    );

    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    monthlyLabels.push(
        monthDate.toLocaleString("en-IN", {
            month: "short"
        })
    );

    const amount = expenses
        .filter(expense => {
            const date = new Date(expense.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );
        })
        .reduce(
            (total, expense) =>
                total + Number(expense.amount),
            0
        );

    monthlyAmounts.push(amount);
}

const monthlyCanvas =
    document.getElementById("monthlyExpenseChart");

if (monthlyExpenseChart) {
    monthlyExpenseChart.destroy();
}

monthlyExpenseChart = new Chart(monthlyCanvas, {
    type: "bar",

    data: {
        labels: monthlyLabels,

        datasets: [{
            label: "Monthly Spending (₹)",
            data: monthlyAmounts,
            backgroundColor: "#6366f1",
            borderRadius: 6
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: true,

        scales: {
            x: {
                ticks: { color: "#cbd5e1" }
            },
            y: {
                beginAtZero: true,
                ticks: { color: "#cbd5e1" }
            }
        },

        plugins: {
            legend: {
                labels: { color: "#cbd5e1" }
            }
        }
    }
});


// =====================================
// SAVINGS ANALYTICS
// =====================================

const totalGoals = savingsGoals.length;

const totalTarget = savingsGoals.reduce(
    (total, goal) =>
        total + Number(goal.targetAmount),
    0
);

const totalSaved = savingsGoals.reduce(
    (total, goal) =>
        total + Number(goal.savedAmount),
    0
);

const completedGoals = savingsGoals.filter(
    goal =>
        Number(goal.targetAmount) > 0 &&
        Number(goal.savedAmount) >= Number(goal.targetAmount)
).length;

document.getElementById("analyticsTotalGoals").textContent =
    totalGoals;

document.getElementById("analyticsTargetAmount").textContent =
    `₹${totalTarget.toLocaleString("en-IN")}`;

document.getElementById("analyticsSavedAmount").textContent =
    `₹${totalSaved.toLocaleString("en-IN")}`;

document.getElementById("analyticsCompletedGoals").textContent =
    completedGoals;


// =====================================
// SAVINGS GOAL PROGRESS LIST
// =====================================

const savingsList =
    document.getElementById("analyticsSavingsList");

savingsList.innerHTML = "";

if (savingsGoals.length === 0) {

    savingsList.innerHTML =
        "<p>No savings goals available.</p>";

} else {

    savingsGoals.forEach(goal => {

        const target = Number(goal.targetAmount);
        const saved = Number(goal.savedAmount);

        const percentage = target > 0
            ? Math.min((saved / target) * 100, 100)
            : 0;

        const item = document.createElement("div");

        item.className = "analytics-category-item";

        item.innerHTML = `
            <div class="analytics-category-header">
                <span>${goal.name}</span>
                <strong>${percentage.toFixed(1)}%</strong>
            </div>

            <div class="analytics-progress">
                <div
                    class="analytics-progress-bar"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <small>
                ₹${saved.toLocaleString("en-IN")}
                / ₹${target.toLocaleString("en-IN")}
            </small>
        `;

        savingsList.appendChild(item);
    });
}


// =====================================
// SAVINGS VS TARGET CHART
// =====================================

const savingsCanvas =
    document.getElementById("savingsChart");

if (savingsChart) {
    savingsChart.destroy();
}

savingsChart = new Chart(savingsCanvas, {
    type: "bar",

    data: {
        labels: savingsGoals.map(goal => goal.name),

        datasets: [
            {
                label: "Amount Saved (₹)",
                data: savingsGoals.map(
                    goal => Number(goal.savedAmount)
                ),
                backgroundColor: "#06b6d4"
            },
            {
                label: "Remaining Amount (₹)",
                data: savingsGoals.map(goal =>
                    Math.max(
                        Number(goal.targetAmount) -
                        Number(goal.savedAmount),
                        0
                    )
                ),
                backgroundColor: "#6366f1"
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: true,

        scales: {
            x: {
                stacked: true,
                ticks: { color: "#cbd5e1" }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: { color: "#cbd5e1" }
            }
        },

        plugins: {
            legend: {
                labels: { color: "#cbd5e1" }
            }
        }
    }
});

        // =====================================
        // DISPLAY SUMMARY CARDS
        // =====================================

        document.getElementById(
            "totalSpent"
        ).textContent =
            `₹${totalSpent.toLocaleString("en-IN")}`;


        document.getElementById(
            "remainingBudget"
        ).textContent =
            `₹${remainingBudget.toLocaleString("en-IN")}`;


        document.getElementById(
            "monthlyBudget"
        ).textContent =
            `₹${monthlyBudget.toLocaleString("en-IN")}`;


        document.getElementById(
            "weeklySpent"
        ).textContent =
            `₹${weeklySpent.toLocaleString("en-IN")}`;

// =====================================
// DISPLAY MONTHLY BUDGET CARD
// =====================================

document.getElementById(
    "budgetAmount"
).textContent =
    `₹${monthlyBudget.toLocaleString("en-IN")}`;


document.getElementById(
    "budgetSpent"
).textContent =
    `₹${totalSpent.toLocaleString("en-IN")}`;


document.getElementById(
    "budgetRemaining"
).textContent =
    `₹${remainingBudget.toLocaleString("en-IN")}`;


const budgetPercentage =
    monthlyBudget > 0
        ? (totalSpent / monthlyBudget) * 100
        : 0;


document.getElementById(
    "budgetPercentage"
).textContent =
    `${budgetPercentage.toFixed(1)}%`;


document.getElementById(
    "budgetProgressBar"
).style.width =
    `${Math.min(budgetPercentage, 100)}%`;
        // =====================================
        // DEBUG / CHECK DATA
        // =====================================

        console.log("Total Spent:", totalSpent);

        console.log(
            "Remaining Budget:",
            remainingBudget
        );

        console.log(
            "Monthly Budget:",
            monthlyBudget
        );

        console.log(
            "This Week:",
            weeklySpent
        );

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        alert(
            "Unable to load dashboard data. Please make sure JSON Server is running."
        );

    }
}




// =========================================
// GET HTML ELEMENTS
// =========================================

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");
const profilePictureInput =
    document.getElementById("profilePictureInput");

const settingsAvatar =
    document.getElementById("settingsAvatar");
const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");
const authContainer =
    document.getElementById("authContainer");

const dashboardContainer =
    document.getElementById("dashboardContainer");

const userName =
    document.getElementById("userName");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileAvatar =
    document.querySelector(".profile-avatar");

const logoutBtn =
    document.getElementById("logoutBtn");


const dashboardNav =
    document.getElementById("dashboardNav");

const expensesNav =
    document.getElementById("expensesNav");
const savingsNav =
    document.getElementById("savingsNav");
const analyticsNav =
    document.getElementById("analyticsNav");
const settingsNav = document.getElementById("settingsNav");
const settingsSection = document.getElementById("settingsSection");

profilePictureInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        const imageData = reader.result;

        settingsAvatar.src = imageData;
        if (profileAvatar) {
    profileAvatar.style.backgroundImage =
        `url("${imageData}")`;

    profileAvatar.style.backgroundSize = "cover";
    profileAvatar.style.backgroundPosition = "center";
    profileAvatar.textContent = "";
}

 
        localStorage.setItem(
            "spendwiseProfilePicture",
            imageData
        );

    };

    reader.readAsDataURL(file);

});
const savedProfilePicture =
    localStorage.getItem("spendwiseProfilePicture");
if (savedProfilePicture) {

    settingsAvatar.src = savedProfilePicture;

    if (profileAvatar) {
        profileAvatar.style.backgroundImage =
            `url("${savedProfilePicture}")`;

        profileAvatar.style.backgroundSize = "cover";
        profileAvatar.style.backgroundPosition = "center";
        profileAvatar.textContent = "";
    }
}
const analyticsSection =
    document.getElementById("analyticsSection");
const savingsSection =
    document.getElementById("savingsSection");
const dashboardContent =
    document.getElementById("dashboardContent");

const expensesSection =
    document.getElementById("expensesSection");
const addExpenseBtn =
    document.getElementById("addExpenseBtn");
const editBudgetBtn =
    document.getElementById("editBudgetBtn");

const budgetModal =
    document.getElementById("budgetModal");

const closeBudgetModal =
    document.getElementById("closeBudgetModal");

const cancelBudgetBtn =
    document.getElementById("cancelBudgetBtn");

const budgetForm =
    document.getElementById("budgetForm");

const monthlyBudgetInput =
    document.getElementById("monthlyBudgetInput");

const expenseModal =
    document.getElementById("expenseModal");

const closeExpenseModal =
    document.getElementById("closeExpenseModal");

const cancelExpenseBtn =
    document.getElementById("cancelExpenseBtn");

const expenseForm =
    document.getElementById("expenseForm");
let editingExpenseId = null;
// =========================================
// SWITCH TO REGISTER
// =========================================

showRegisterBtn.addEventListener("click", () => {

    loginSection.classList.add("hidden");

    registerSection.classList.remove("hidden");

});


// =========================================
// SWITCH TO LOGIN
// =========================================

showLoginBtn.addEventListener("click", () => {

    registerSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

});


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();


    try {

        const users = await getUsers();

        const user = users.find(
            (user) =>
                user.email === email &&
                user.password === password
        );


        if (!user) {

            alert("Invalid email or password.");

            return;
        }


        // Save logged-in user
        localStorage.setItem(
            "spendwiseUser",
            JSON.stringify(user)
        );


        authContainer.classList.add("hidden");
        dashboardContainer.classList.remove("hidden");
        userName.textContent =
            `${user.name} 👋`;
        profileName.textContent =
            user.name;
        profileEmail.textContent =
            user.email;
        profileAvatar.textContent =
            user.name.charAt(0).toUpperCase();
        loadDashboard(user);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server. Please make sure JSON Server is running."
        );

    }

});


// =========================================
// CREATE NEW ACCOUNT
// =========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();


    // =====================================
    // VALIDATION
    // =====================================

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    if (password !== confirmPassword) {

        alert(
            "Password and Confirm Password do not match."
        );

        return;
    }


    try {

        // Check whether email already exists

        const users = await getUsers();

        const existingUser = users.find(
            (user) =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


        if (existingUser) {

            alert(
                "An account with this email already exists."
            );

            return;
        }


        // Create new user

        const newUser = {

            id: `user${Date.now()}`,

            name: name,

            email: email,

            password: password

        };


        await createUser(newUser);


        alert(
            "Account created successfully! 🎉\n\nYou can now login."
        );


        // Clear registration form

        registerForm.reset();


        // Go back to login

        registerSection.classList.add("hidden");

        loginSection.classList.remove("hidden");


        // Put email automatically in login field

        document.getElementById("loginEmail").value =
            email;


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to create account. Please make sure JSON Server is running."
        );

    }

    
});
// =========================================
// LOGOUT
// =========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("spendwiseUser");

    dashboardContainer.classList.add("hidden");

    authContainer.classList.remove("hidden");

    loginForm.reset();

});
// =========================================
// DISPLAY EXPENSES IN TABLE
// =========================================

function displayExpenses(expenses) {

    const tableBody =
        document.getElementById("expensesTableBody");

    const expenseCount =
        document.getElementById("expenseCount");

    tableBody.innerHTML = "";

    expenseCount.textContent =
        `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`;


    if (expenses.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-expenses">
                    No expenses found.
                </td>
            </tr>
        `;

        return;
    }


    expenses.forEach((expense) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${expense.title}</td>

            <td>
                ₹${Number(expense.amount).toLocaleString("en-IN")}
            </td>

            <td>
                <span class="category-badge">
                    ${expense.category}
                </span>
            </td>

            <td>
                ${expense.date}
            </td>

            <td>
                ${expense.description || "-"}
            </td>

            <td>
                <button
                    class="edit-expense-btn"
                    data-id="${expense.id}"
                >
                    ✏️
                </button>

                <button
                    class="delete-expense-btn"
                    data-id="${expense.id}"
                >
                    🗑️
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });
}
// =========================================
// LOAD EXPENSES TABLE
// =========================================

async function loadExpensesTable(userId) {

    try {

        const expenses =
            await getExpenses(userId);

        displayExpenses(expenses);

    } catch (error) {

        console.error(
            "Expenses loading error:",
            error
        );

    }
}
// =========================================
// APPLY EXPENSE FILTERS
// =========================================

async function applyExpenseFilters() {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("spendwiseUser")
        );

    if (!loggedInUser) {
        return;
    }

    const expenses =
        await getExpenses(loggedInUser.id);


    const searchText =
        document.getElementById("expenseSearch")
            .value
            .trim()
            .toLowerCase();


    const selectedCategory =
        document.getElementById("categoryFilter")
            .value;


    const selectedDate =
        document.getElementById("dateFilter")
            .value;


    const filteredExpenses =
        expenses.filter((expense) => {

            // SEARCH
            const matchesSearch =
                searchText === "" ||
                expense.title
                    .toLowerCase()
                    .includes(searchText) ||
                expense.category
                    .toLowerCase()
                    .includes(searchText) ||
                (expense.description || "")
                    .toLowerCase()
                    .includes(searchText);


            // CATEGORY
            const matchesCategory =
                selectedCategory === "" ||
                expense.category === selectedCategory;


            // DATE
            const matchesDate =
                selectedDate === "" ||
                expense.date === selectedDate;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesDate
            );

        });


    displayExpenses(filteredExpenses);

}
// =========================================
// FILTER EVENT LISTENERS
// =========================================

document
    .getElementById("expenseSearch")
    .addEventListener(
        "input",
        applyExpenseFilters
    );


document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        applyExpenseFilters
    );


document
    .getElementById("dateFilter")
    .addEventListener(
        "change",
        applyExpenseFilters
    );
// =========================================
// DELETE EXPENSE
// =========================================

document.addEventListener("click", async (event) => {

    const deleteButton =
        event.target.closest(".delete-expense-btn");

    if (!deleteButton) {
        return;
    }

    const expenseId =
        deleteButton.dataset.id;

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        await deleteExpense(expenseId);

        alert("Expense deleted successfully! 🗑️");


        const loggedInUser =
            JSON.parse(
                localStorage.getItem("spendwiseUser")
            );


        if (loggedInUser) {

            await loadExpensesTable(
                loggedInUser.id
            );

            await loadDashboard(
                loggedInUser
            );

        }

    } catch (error) {

        console.error(
            "Delete expense error:",
            error
        );

        alert(
            "Unable to delete expense. Please make sure JSON Server is running."
        );

    }

});
// =========================================
// EDIT EXPENSE
// =========================================

document.addEventListener("click", async (event) => {

    const editButton =
        event.target.closest(".edit-expense-btn");

    if (!editButton) {
        return;
    }

    const expenseId =
        editButton.dataset.id;

    try {

        const loggedInUser =
            JSON.parse(
                localStorage.getItem("spendwiseUser")
            );

        const expenses =
            await getExpenses(loggedInUser.id);

        const expense =
            expenses.find(
                (item) => item.id === expenseId
            );

        if (!expense) {
            alert("Expense not found.");
            return;
        }

        // Remember which expense we're editing
        editingExpenseId = expense.id;


        // Fill the form with existing data
        document.getElementById("expenseTitle").value =
            expense.title;

        document.getElementById("expenseAmount").value =
            expense.amount;

        document.getElementById("expenseCategory").value =
            expense.category;

        document.getElementById("expenseDate").value =
            expense.date;

        document.getElementById("expenseDescription").value =
            expense.description || "";


        // Change modal title
        document.querySelector(
            "#expenseModal .modal-header h2"
        ).textContent = "Edit Expense";


        // Change submit button text
        document.querySelector(
            "#expenseForm button[type='submit']"
        ).textContent = "Update Expense";


        expenseModal.classList.remove("hidden");

    } catch (error) {

        console.error(
            "Edit expense error:",
            error
        );

        alert("Unable to load expense details.");

    }

});
// =========================================
// DASHBOARD / EXPENSES NAVIGATION
// =========================================
dashboardNav.addEventListener("click", () => {
        savingsSection.classList.add("hidden");


    dashboardContent.classList.remove("hidden");
    expensesSection.classList.add("hidden");
    analyticsSection.classList.add("hidden");
    settingsSection.classList.add("hidden");

    dashboardNav.classList.add("active");
    expensesNav.classList.remove("active");
    analyticsNav.classList.remove("active");
    settingsNav.classList.remove("active");

});


expensesNav.addEventListener("click", () => {
    savingsSection.classList.add("hidden");

    dashboardContent.classList.add("hidden");
    expensesSection.classList.remove("hidden");
    analyticsSection.classList.add("hidden");
    settingsSection.classList.add("hidden");

    expensesNav.classList.add("active");
    dashboardNav.classList.remove("active");
    analyticsNav.classList.remove("active");
    settingsNav.classList.remove("active");

});
// =========================================
// ANALYTICS NAVIGATION
// =========================================
analyticsNav.addEventListener("click", () => {
    savingsSection.classList.add("hidden");

    dashboardContent.classList.add("hidden");
    expensesSection.classList.add("hidden");
    analyticsSection.classList.remove("hidden");
    settingsSection.classList.add("hidden");

    analyticsNav.classList.add("active");
    dashboardNav.classList.remove("active");
    expensesNav.classList.remove("active");
    settingsNav.classList.remove("active");

});
settingsNav.addEventListener("click", () => {
    savingsSection.classList.add("hidden");
    dashboardContent.classList.add("hidden");
    expensesSection.classList.add("hidden");
    analyticsSection.classList.add("hidden");
    settingsSection.classList.remove("hidden");

    settingsNav.classList.add("active");
    dashboardNav.classList.remove("active");
    expensesNav.classList.remove("active");
    analyticsNav.classList.remove("active");

});
// =========================================
// SAVINGS GOALS NAVIGATION
// =========================================

savingsNav.addEventListener("click", () => {

    dashboardContent.classList.add("hidden");
    expensesSection.classList.add("hidden");
    analyticsSection.classList.add("hidden");
    settingsSection.classList.add("hidden");

    savingsSection.classList.remove("hidden");
const loggedInUser = JSON.parse(
    localStorage.getItem("spendwiseUser")
);

if (loggedInUser) {
    loadSavingsGoals(loggedInUser.id);
}
    savingsNav.classList.add("active");
    dashboardNav.classList.remove("active");
    expensesNav.classList.remove("active");
    analyticsNav.classList.remove("active");
    settingsNav.classList.remove("active");

});
// =========================================
// LOAD SAVINGS GOALS
// =========================================
async function loadSavingsGoals(userId) {
    const container = document.getElementById("savingsGoalsContainer");

    try {
        const goals = await getSavingsGoals(userId);

        if (goals.length === 0) {
            container.innerHTML = "<p>No savings goals yet. Add your first goal!</p>";
            return;
        }

        container.innerHTML = goals.map(goal => {
            const progress = Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
            );

            return `
                <div class="savings-goal-card">
                    <h3>${goal.name}</h3>
                    <p>Target: ₹${goal.targetAmount}</p>
                    <p>Saved: ₹${goal.savedAmount}</p>
                    <p>Target Date: ${goal.targetDate}</p>
                    <p>Progress: ${progress.toFixed(1)}%</p>
             <button class="update-goal-btn"
        onclick="updateGoalAmount('${goal.id}', ${goal.savedAmount}, ${goal.targetAmount})">
    + Update Savings
</button>
<button class="delete-goal-btn"
        onclick="removeSavingsGoal('${goal.id}')">
    Delete Goal
</button>

                    <div class="goal-progress-bar">
    <div class="goal-progress-fill"
         style="width: ${progress}%">
    </div>
</div>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Error loading savings goals:", error);
        container.innerHTML = "<p>Unable to load savings goals.</p>";
    }
}
// =========================================
// ADD SAVINGS GOAL POPUP
// =========================================

const addGoalBtn = document.getElementById("addGoalBtn");
const goalModal = document.getElementById("goalModal");
const closeGoalModal = document.getElementById("closeGoalModal");
const cancelGoalBtn = document.getElementById("cancelGoalBtn");
const goalForm = document.getElementById("goalForm");
// SAVE NEW GOAL
goalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loggedInUser = JSON.parse(
        localStorage.getItem("spendwiseUser")
    );

    const goalData = {
        id: `goal${Date.now()}`,
        userId: loggedInUser.id,
        name: document.getElementById("goalName").value.trim(),
        targetAmount: Number(document.getElementById("goalAmount").value),
        savedAmount: Number(document.getElementById("goalSaved").value),
        targetDate: document.getElementById("goalDate").value,
        description: ""
    };

    try {
        await addSavingsGoal(goalData);
        await loadSavingsGoals(loggedInUser.id);
        await loadDashboard(loggedInUser);

        goalForm.reset();
        document.getElementById("goalSaved").value = 0;

        goalModal.classList.add("hidden");

        alert("Savings goal added successfully! 🎯");

    } catch (error) {
        console.error("Save Goal Error:", error);
        alert("Unable to save goal. Check whether JSON Server is running.");
    }
});
addGoalBtn.addEventListener("click", () => {
    goalModal.classList.remove("hidden");
});

closeGoalModal.addEventListener("click", () => {
    goalModal.classList.add("hidden");
});

cancelGoalBtn.addEventListener("click", () => {
    goalModal.classList.add("hidden");
});


const loggedInUser =
    JSON.parse(
        localStorage.getItem("spendwiseUser")
    );

if (loggedInUser) {
     // Restore the dashboard
    authContainer.classList.add("hidden");
    dashboardContainer.classList.remove("hidden");

    // Restore user details
    userName.textContent = `${loggedInUser.name} 👋`;
    profileName.textContent = loggedInUser.name;
    profileEmail.textContent = loggedInUser.email;

    profileAvatar.textContent =
        loggedInUser.name.charAt(0).toUpperCase();

    // Load dashboard data
    loadDashboard(loggedInUser);
    loadExpensesTable(loggedInUser.id);
}
// =========================================
// ADD EXPENSE MODAL
// =========================================

addExpenseBtn.addEventListener("click", () => {

    editingExpenseId = null;

    expenseForm.reset();

    document.getElementById("expenseDate").value =
        new Date()
            .toISOString()
            .split("T")[0];

    expenseModal.classList.remove("hidden");

});
// =========================================
// CLOSE EXPENSE MODAL
// =========================================

closeExpenseModal.addEventListener("click", () => {

    expenseModal.classList.add("hidden");

});

cancelExpenseBtn.addEventListener("click", () => {

    expenseModal.classList.add("hidden");

});
const expenseDate =
    document.getElementById("expenseDate");

expenseDate.value =
    new Date().toISOString().split("T")[0];
// =========================================
// SAVE EXPENSE
// =========================================

expenseForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("spendwiseUser")
        );

    if (!loggedInUser) {
        alert("Please login first.");
        return;
    }


    const title =
        document.getElementById("expenseTitle")
            .value.trim();

    const amount =
        Number(
            document.getElementById("expenseAmount")
                .value
        );

    const category =
        document.getElementById("expenseCategory")
            .value;

    const date =
        document.getElementById("expenseDate")
            .value;

    const description =
        document.getElementById("expenseDescription")
            .value.trim();


    // =====================================
    // VALIDATION
    // =====================================

    if (
        title === "" ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {

        alert("Please fill in all required fields.");
        return;
    }


    const expenseData = {

        id: `expense${Date.now()}`,

        userId: loggedInUser.id,

        title: title,

        amount: amount,

        category: category,

        date: date,

        description: description

    };


    try {

        if (editingExpenseId) {

    await updateExpense(
        editingExpenseId,
        expenseData
    );

    alert("Expense updated successfully! ✏️");

} else {

    await addExpense(expenseData);

    alert("Expense added successfully! 🎉");

}


editingExpenseId = null;

expenseForm.reset();

document.getElementById("expenseDate").value =
    new Date()
        .toISOString()
        .split("T")[0];

document.querySelector(
    "#expenseModal .modal-header h2"
).textContent = "Add New Expense";

document.querySelector(
    "#expenseForm button[type='submit']"
).textContent = "Add Expense";

expenseModal.classList.add("hidden");


await loadDashboard(loggedInUser);

await loadExpensesTable(
    loggedInUser.id
);

    } catch (error) {

        console.error(
            "Add expense error:",
            error
        );

        alert(
            "Unable to save expense. Please make sure JSON Server is running."
        );

    }

});
// ===============================
// BUDGET MODAL
// ===============================

editBudgetBtn.addEventListener("click", () => {

    const currentBudget =
        document.getElementById("budgetAmount").textContent
            .replace("₹", "")
            .replace(/,/g, "");

    monthlyBudgetInput.value = currentBudget;

    budgetModal.classList.remove("hidden");
});

closeBudgetModal.addEventListener("click", () => {
    budgetModal.classList.add("hidden");
});

cancelBudgetBtn.addEventListener("click", () => {
    budgetModal.classList.add("hidden");
});
// ===============================
// SAVE MONTHLY BUDGET
// ===============================

budgetForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loggedInUser =
        JSON.parse(localStorage.getItem("spendwiseUser"));

    if (!loggedInUser) {
        alert("Please login first.");
        return;
    }

    const newBudget =
        Number(monthlyBudgetInput.value);

    if (newBudget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    try {

        const budgets =
            await getBudget(loggedInUser.id);

        if (budgets.length === 0) {
            alert("Budget record not found.");
            return;
        }

        const budget = budgets[0];

        await updateBudget(budget.id, {
            userId: loggedInUser.id,
            monthlyLimit: newBudget
        });

        budgetModal.classList.add("hidden");

        budgetForm.reset();

        await loadDashboard(loggedInUser);

        alert("Monthly budget updated successfully!");

    } catch (error) {

        console.error("Budget update error:", error);

        alert("Failed to update budget.");
    }
});
// DELETE SAVINGS GOAL
async function removeSavingsGoal(goalId) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this goal?"
    );

    if (!confirmDelete) return;

    try {
        await deleteSavingsGoal(goalId);

        const loggedInUser = JSON.parse(
            localStorage.getItem("spendwiseUser")
        );

        await loadSavingsGoals(loggedInUser.id);
        await loadDashboard(loggedInUser);

        alert("Savings goal deleted successfully!");

    } catch (error) {
        console.error("Delete Goal Error:", error);
        alert("Unable to delete goal.");
    }
}
window.removeSavingsGoal = removeSavingsGoal;
// UPDATE SAVINGS AMOUNT
async function updateGoalAmount(goalId, currentAmount, targetAmount) {
    const newAmount = prompt(
        `Current savings: ₹${currentAmount}\nEnter your new total savings amount:`
    );

    if (newAmount === null) return;

    const amount = Number(newAmount);

    if (
        newAmount.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > targetAmount
    ) {
        alert("Please enter a valid amount between ₹0 and ₹" + targetAmount);
        return;
    }

    try {
        await updateSavingsGoal(goalId, {
            savedAmount: amount
        });

        const loggedInUser = JSON.parse(
            localStorage.getItem("spendwiseUser")
        );

        await loadSavingsGoals(loggedInUser.id);
        await loadDashboard(loggedInUser);

        alert("Savings updated successfully! 🎯");

    } catch (error) {
        console.error("Update Savings Error:", error);
        alert("Unable to update savings.");
    }
}

window.updateGoalAmount = updateGoalAmount;