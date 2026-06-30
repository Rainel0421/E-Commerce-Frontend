// frontend/src/api/upload.api.js
import api from "./axios.config";

// Sube una imagen y devuelve { imageUrl, publicId }
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/upload/product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
