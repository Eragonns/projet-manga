import axios from "axios";

const axiosRender = axios.create({
  baseURL: "https://scanmangaverse.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});
axiosRender.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosRender;