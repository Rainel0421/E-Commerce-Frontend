import api from "./axios.config";

export const getProducts = async (filters = {}) => {
  const { data } = await api.get("/products", { params: filters });
  return data.data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};


// --- Rutas de ADMIN (requieren estar logueado con rol ADMIN) ---

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data.data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.patch(`/products/${id}`, payload);
  return data.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
