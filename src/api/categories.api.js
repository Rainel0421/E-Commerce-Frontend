// frontend/src/api/categories.api.js
import api from "./axios.config";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/categories", payload);
  return data.data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.patch(`/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};
