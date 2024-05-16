import axios from "axios";

export const api = axios.create({
  baseURL: "https://cashcare.cloud/api",
  // baseURL: "http://localhost:3000/api",
});
