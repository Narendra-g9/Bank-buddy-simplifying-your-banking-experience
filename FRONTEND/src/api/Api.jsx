import axios from "axios";

// In production, frontend is served by the backend so use relative URL
// In development, use localhost with the backend port
const isDev = import.meta.env.DEV;
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 4001;
const api_url = isDev
  ? `http://localhost:${BACKEND_PORT}/api/`
  : `/api/`;

const api = axios.create({
  baseURL: api_url,
});

api.interceptors.request.use((config) => {
  const bearerToken = localStorage.getItem("token");

  config.headers["Authorization"] = `Bearer ${bearerToken}`;
  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default api;
