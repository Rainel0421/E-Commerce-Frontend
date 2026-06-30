import { useState, useRef } from 'react';
import { uploadProductImage } from '../../api/upload.api';

// Componente controlado: recibe el valor actual (imageUrl) y notifica
// hacia arriba cuando cambia, igual que un <input> normal de React.
export default function ImageUploadInput({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación rápida en el cliente (UX), la validación REAL ya está en el backend
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const { imageUrl } = await uploadProductImage(file);
      onChange(imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>

      {value ? (
        <div className="relative w-32 h-32">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
            aria-label="Quitar imagen"
          >
            ✕
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm border border-gray-300 rounded px-3 py-2"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}