import axios from "axios";

const axiosRender = axios.create({
  baseURL: "https://scanmangaverse.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosRender;
