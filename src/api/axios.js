import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
  timeout: 10000,
});

export default axiosInstance;
