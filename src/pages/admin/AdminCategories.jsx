// frontend/src/pages/admin/AdminCategories.jsx
import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories.api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    let active = true;
    async function fetchCategories() {
      try {
        const data = await getCategories();
        if (!active) return;
        setCategories(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }
      setName("");
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la categoría.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    setDeleteError(null);
    try {
      await deleteCategory(category.id);
      setConfirmingDeleteId(null);
      await loadCategories();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          "No se pudo eliminar (puede tener productos asociados)."
      );
      setConfirmingDeleteId(null);
    }
  };

  const handleStartEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setConfirmingDeleteId(null);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setError(null);
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-gray-400 py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando categorías…</span>
      </div>
    );
  }

  // ── Vista principal ──────────────────────────────────────
  return (
    <div className="w-full space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Tag className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 leading-tight">
            Categorías
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {categories.length}{" "}
            {categories.length === 1 ? "categoría registrada" : "categorías registradas"}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {editingId ? "Editar categoría" : "Nueva categoría"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Electrónica, Ropa, Hogar…"
            required
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3.5 py-2.5
                       placeholder:text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                       transition"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl
                       text-sm font-medium bg-gray-900 text-white
                       hover:bg-gray-700 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all w-full sm:w-auto"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingId ? "Actualizar" : "Agregar"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              aria-label="Cancelar edición"
              className="w-full sm:w-10 h-10 flex items-center justify-center rounded-xl
                         border border-gray-200 text-gray-400
                         hover:text-gray-700 hover:bg-gray-50
                         active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Error de eliminación */}
      {deleteError && (
        <div className="flex items-start gap-2.5 text-sm text-red-700
                        bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {deleteError}
        </div>
      )}

      {/* Lista de categorías */}
      {categories.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="w-10 h-10 mx-auto mb-3 text-gray-200" strokeWidth={1.5} />
          <p className="text-sm text-gray-400">
            Aún no hay categorías. ¡Crea la primera!
          </p>
        </div>
      ) : (
        <ul className="space-y-2 sm:space-y-3">
          {categories.map((c) => (
            <li
              key={c.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0
                          px-4 py-3 rounded-xl border transition-all duration-150
                          ${editingId === c.id
                            ? "border-indigo-200 bg-indigo-50/40"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                          }`}
            >
              {/* Nombre */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                    editingId === c.id ? "bg-indigo-400" : "bg-gray-200"
                  }`}
                />
                <span className="text-sm font-medium text-gray-800 truncate">
                  {c.name}
                </span>
              </div>

              {/* Acciones */}
              {confirmingDeleteId === c.id ? (
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <span className="text-xs text-gray-400 hidden sm:inline">¿Eliminar?</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDelete(c)}
                      className="flex-1 sm:flex-none px-3 sm:px-2.5 py-2 sm:py-1 rounded-lg bg-red-500 text-white
                                 text-xs font-semibold hover:bg-red-600 active:scale-95 transition-all"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(null)}
                      className="flex-1 sm:flex-none px-3 sm:px-2.5 py-2 sm:py-1 rounded-lg border border-gray-200
                                 text-gray-600 text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* Acciones normales */
                <div className="flex items-center gap-0.5 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleStartEdit(c)}
                    aria-label={`Editar ${c.name}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                               text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                               transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(c.id)}
                    aria-label={`Eliminar ${c.name}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                               text-gray-400 hover:text-red-500 hover:bg-red-50
                               transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}