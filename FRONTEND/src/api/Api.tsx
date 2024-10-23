import axios from "axios";

const api_url = "http://localhost:4000/api/";

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
