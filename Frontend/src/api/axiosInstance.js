/*
  WHAT IS AXIOS?
  ---------------
  Axios is a library for making HTTP requests (calling your backend API).
  It's like fetch() but with better features:
  - Automatic JSON parsing
  - Interceptors (run code before every request OR after every response)
  - Better error handling

  WHAT IS AN "INSTANCE"?
  -----------------------
  Instead of configuring axios from scratch on every API call,
  we create ONE configured "instance" here and import it everywhere.

  Our instance is pre-configured with:
  1. baseURL  → all requests automatically prepend http://localhost:5052/api
  2. Request interceptor → automatically attaches JWT token to every request

  EXAMPLE USAGE (in any service file):
    import api from "../api/axiosInstance";
    const response = await api.get("/pets");       → GET /api/pets
    const response = await api.post("/auth/login", { email, password });
*/

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Uses env var for production, defaults to /api
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  REQUEST INTERCEPTOR
  --------------------
  This runs BEFORE every single HTTP request is sent.
  
  We read the JWT token from localStorage (where we'll save it after login)
  and add it to the Authorization header.

  The backend expects: Authorization: Bearer <token>
  This is the JWT standard way of authenticating API calls.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("petadopt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/*
  RESPONSE INTERCEPTOR
  ---------------------
  This runs AFTER every response comes back.

  If the backend returns 401 (Unauthorized), it means the token
  expired or is invalid. We automatically clear the token and
  redirect to the login page so the user can log in again.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("petadopt_token");
      localStorage.removeItem("petadopt_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
