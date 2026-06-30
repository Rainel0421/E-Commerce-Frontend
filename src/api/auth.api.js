// frontend/src/api/auth.api.js
import api from "./axios.config";

export const registerRequest = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data.data; // { token, user }
};

export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data; // { token, user }
};

export const getMeRequest = async () => {
  const { data } = await api.get("/auth/me");
  return data.data; // user
};
