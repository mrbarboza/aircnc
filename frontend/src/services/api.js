import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:443"
});

export default api;
