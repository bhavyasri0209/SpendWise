export function validateExpense(title, amount, category, date) {

    if (title === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields");
        return false;
    }

    if (Number(amount) <= 0) {
        alert("Amount must be greater than 0");
        return false;
    }

    return true;
}