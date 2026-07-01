// frontend/src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products.api";
import { getCategories } from "../../api/categories.api";
import ImageUploadInput from "../../components/admin/ImageUploadInput";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};

// Badge de stock: rojo agotado · ámbar bajo · gris normal
function StockBadge({ stock }) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
        Agotado
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600">
        {stock} unid.
      </span>
    );
  return <span className="text-sm text-gray-700">{stock}</span>;
}

// ── Card de producto (móvil) ────────────────────────────

function ProductCard({ product, onEdit, onDelete, confirmingId }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Imagen */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {product.category?.name || "Sin categoría"}
          </p>
        </div>

        {product.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precio y Stock */}
        <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        {/* Acciones */}
        {confirmingId === product.id ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(product)}
              className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold
                         hover:bg-red-600 active:scale-95 transition-all"
            >
              Confirmar
            </button>
            <button
              onClick={() => onDelete(null)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 px-3 py-2 rounded-lg text-indigo-600 font-medium text-sm
                         hover:bg-indigo-50 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 px-3 py-2 rounded-lg text-red-600 font-medium text-sm
                         hover:bg-red-50 transition"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Fila de tabla (desktop) ────────────────────────────

function ProductRow({ product, onEdit, onDelete, confirmingId }) {
  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      {/* Thumbnail */}
      <td className="px-5 py-4">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
          )}
        </div>
      </td>

      {/* Nombre */}
      <td className="px-5 py-4">
        <span className="font-medium text-gray-900 line-clamp-1">
          {product.name}
        </span>
      </td>

      {/* Categoría */}
      <td className="px-5 py-4 text-gray-400 hidden lg:table-cell text-sm">
        {product.category?.name || "—"}
      </td>

      {/* Precio */}
      <td className="px-5 py-4 font-semibold text-gray-900 text-sm">
        ${Number(product.price).toFixed(2)}
      </td>

      {/* Stock */}
      <td className="px-5 py-4">
        <StockBadge stock={product.stock} />
      </td>

      {/* Acciones */}
      <td className="px-5 py-4">
        {confirmingId === product.id ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDelete(product)}
              className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold
                         hover:bg-red-600 active:scale-95 transition-all"
            >
              Confirmar
            </button>
            <button
              onClick={() => onDelete(null)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              No
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 justify-end">
            <button
              onClick={() => onEdit(product)}
              aria-label={`Editar ${product.name}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                         transition"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              aria-label={`Eliminar ${product.name}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         text-gray-400 hover:text-red-500 hover:bg-red-50
                         transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Solo para recargar tras mutaciones
  const loadData = async () => {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
  };

  // Carga inicial con cleanup
  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (!active) return;
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        if (active) setError("No se pudieron cargar los datos.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || product.category?.id || "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Error al guardar el producto."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (typeof product === "number") {
      setConfirmingDeleteId(product);
      return;
    }

    if (product === null) {
      setConfirmingDeleteId(null);
      return;
    }

    setDeleteError(null);
    try {
      await deleteProduct(product.id);
      setConfirmingDeleteId(null);
      await loadData();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "No se pudo eliminar el producto."
      );
      setConfirmingDeleteId(null);
    }
  };

  // ── Estados de carga / error ─────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-gray-400 py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando productos…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {error}
      </div>
    );
  }

  // ── Vista principal ──────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              Productos
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {products.length}{" "}
              {products.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
        <button
          onClick={openCreateForm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5
                     rounded-xl text-sm font-medium bg-gray-900 text-white
                     hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo producto</span>
        </button>
      </div>

      {/* Error de eliminación */}
      {deleteError && (
        <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {deleteError}
        </div>
      )}

      {/* Vista móvil: Grid de cards */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package
            className="w-12 h-12 mx-auto mb-3 text-gray-200"
            strokeWidth={1.5}
          />
          <p className="text-sm text-gray-400">
            Aún no hay productos. ¡Agrega el primero!
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Grid de cards */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditForm}
                onDelete={handleDelete}
                confirmingId={confirmingDeleteId}
              />
            ))}
          </div>

          {/* Desktop: Tabla */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-12 px-5 py-3" />
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Categoría
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="w-28 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    confirmingId={confirmingDeleteId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Modal crear / editar ──────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
                className="w-8 h-8 flex items-center justify-center rounded-lg
                           text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nombre
                </label>
                <input
                  name="name"
                  placeholder="Ej: Camiseta básica blanca"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5
                             placeholder:text-gray-300
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                             transition"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  name="description"
                  placeholder="Descripción del producto…"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5
                             placeholder:text-gray-300 resize-none
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                             transition"
                />
              </div>

              {/* Precio + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                      $
                    </span>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full text-sm border border-gray-200 rounded-xl pl-7 pr-3.5 py-2.5
                                 placeholder:text-gray-300
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                                 transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Stock
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5
                               placeholder:text-gray-300
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                               transition"
                  />
                </div>
              </div>

              {/* Imagen */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Imagen
                </label>
                <ImageUploadInput
                  value={form.imageUrl}
                  onChange={(url) =>
                    setForm((prev) => ({ ...prev, imageUrl: url }))
                  }
                />
              </div>

              {/* Categoría */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categoría
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5
                             text-gray-700
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                             transition"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5
                             text-sm font-medium text-gray-600
                             hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5
                             bg-gray-900 text-white rounded-xl py-2.5
                             text-sm font-medium hover:bg-gray-700 active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {submitting ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}