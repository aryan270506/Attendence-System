// axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.131.110.253:5000", // Backend server URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
