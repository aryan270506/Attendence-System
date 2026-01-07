// axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.250.106.253:5000",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
