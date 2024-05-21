import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://cashcare.cloud/api",
  // baseURL: "http://localhost:3000/api",
});
