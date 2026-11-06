# 💰 SpendWise – Student Expense Manager

**SpendWise** is a simple and user-friendly student expense management web application designed to help students track their daily expenses, manage budgets, monitor savings goals, and understand their spending habits.

## 📌 Project Overview

Managing money can be challenging for students. SpendWise provides a centralized platform to record expenses, set monthly budgets, monitor category-wise spending, and track savings goals.

## ✨ Features

- **User Authentication:** Register, login, and logout.
- **Dashboard:** View total spending, remaining balance, monthly budget, and weekly expenses.
- **Expense Management:** Add, view, edit, and delete expenses.
- **Budget Management:** Set and manage monthly budgets.
- **Category Limits:** Set spending limits for different expense categories.
- **Savings Goals:** Create and track personal savings goals.
- **Analytics:** Visualize spending patterns through charts.
- **Profile Picture:** Customize your profile.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the application |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| JSON Server | Backend REST API |
| Axios | API communication |
| JSON | Data storage |

## 🏗️ Project Architecture

```text
SpendWise/
│
├── views/
│   └── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── utils.js
│   └── service/
│       ├── apiConfig.js
│       └── expenseService.js
│
├── exception/
│   ├── apiException.js
│   └── validationException.js
│
├── assets/
│
├── db.json
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bhavyasri0209/SpendWise.git
```

### 2. Open the Project Folder

```bash
cd SpendWise
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

```bash
npm start
```

The JSON Server backend will start using the configured port.

### 5. Run the Frontend

Open `views/index.html` using the VS Code Live Server extension.

## 🔗 API Endpoints

The application uses JSON Server to provide REST API endpoints.

| Endpoint | Description |
|---|---|
| `/users` | User information |
| `/expenses` | Expense records |
| `/budgets` | Budget information |
| `/categoryLimits` | Category spending limits |
| `/savingsGoals` | Savings goal records |

## 📂 Expense Categories

SpendWise supports different expense categories to organize spending:

- Food & Mess
- Travel
- Shopping
- Bills
- Education
- Entertainment
- Technology
- Hostel
- Other

## 🌐 Live Deployment

- **Frontend:** https://spendwise-phi-three.vercel.app
- **Backend:** https://spendwise-backend-vwik.onrender.com

## 🎯 Project Objectives

- Encourage students to develop better financial habits.
- Simplify daily expense tracking.
- Help students manage monthly budgets.
- Monitor category-wise spending.
- Encourage savings through personal goals.
- Provide a clear understanding of spending patterns.

## 🚀 Future Enhancements

- Integration with MongoDB or PostgreSQL for persistent storage.
- Secure authentication and password encryption.
- Export expense reports as PDF or Excel.
- Monthly spending notifications.
- Advanced financial analytics.
- Improved mobile responsiveness.

## 👩‍💻 Project Team

**Department:** Computer Science and Engineering

**University:** Vignan's Foundation for Science, Technology and Research (VFSTR)

**Team Members:**

1. P. Bhavyasri
2. A. Durga Naga Lakshmi
3. Y.V. Naresh Yadav

## 📜 License

This project was developed for academic and educational purposes.

---

⭐ If you find this project useful, consider giving it a star!

**SpendWise – Smart Money Management for Students.**
