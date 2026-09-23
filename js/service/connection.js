import axios from "https://cdn.jsdelivr.net/npm/axios/+esm";

const API_URL = "http://localhost:3000/expenses";

export function getData() {
    return axios.get(API_URL);
}

export function addData(expense) {
    return axios.post(API_URL, expense);
}

export function updateData(id, expense) {
    return axios.put(`${API_URL}/${id}`, expense);
}

export function deleteData(id) {
    return axios.delete(`${API_URL}/${id}`);
}