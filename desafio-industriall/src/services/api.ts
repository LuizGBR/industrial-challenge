import axios from "axios";

const api = axios.create({
  baseURL: "https://desafio-iall.azurewebsites.net/api/",
});

export default api;