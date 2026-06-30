// frontend/src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  ImageOff,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { getProductById } from "../api/products.api";
import { useCart } from "../context/cart.Context";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        if (isMounted) setProduct(data);
      } catch {
        if (isMounted) setError("Producto no encontrado.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const increment = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2.5 text-gray-400 py-24">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando producto…</span>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
          <div
          className="flex items-center gap-2 text-sm text-red-700
                        bg-red-50 border border-red-100 rounded-xl px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Volver ────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400
                   hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* ── Imagen ──────────────────────────────────────── */}
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <ImageOff className="w-16 h-16 text-gray-200" strokeWidth={1} />
              <span className="text-sm text-gray-300 font-medium">
                Sin imagen
              </span>
            </div>
          )}

          {/* Pill de categoría — igual que en ProductCard */}
          {product.category?.name && (
            <span
              className="absolute top-4 left-4
                             inline-flex items-center gap-1.5
                             px-3 py-1.5 rounded-full
                             bg-white/90 backdrop-blur-sm shadow-sm
                             text-xs font-semibold text-gray-700 tracking-wide"
            >
              <Tag className="w-3 h-3" />
              {product.category.name}
            </span>
          )}
        </div>

        {/* ── Información ─────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Nombre */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <p className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">
            ${Number(product.price).toFixed(2)}
          </p>

          {/* Descripción */}
          {product.description && (
            <p className="mt-5 text-sm text-gray-500 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* ── Acciones ──────────────────────────────────── */}
          <div className="mt-8 flex flex-col gap-3">
            {outOfStock ? (
              /* Sin stock */
              <div
                className="flex items-center gap-2.5 text-sm font-medium text-red-700
                              bg-red-50 border border-red-100 rounded-xl px-4 py-3"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                Sin stock disponible
              </div>
            ) : (
              <>
                {/* Aviso stock bajo */}
                {lowStock && (
                  <div
                    className="flex items-center gap-2.5 text-sm font-medium text-amber-700
                                  bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    ¡Solo quedan {product.stock} unidades!
                  </div>
                )}

                {/* Stepper de cantidad */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-700">
                    Cantidad
                  </span>

                  <div className="flex items-center">
                    <button
                      onClick={decrement}
                      disabled={quantity <= 1}
                      aria-label="Reducir cantidad"
                      className="w-9 h-9 flex items-center justify-center rounded-l-xl
                                 border border-gray-200 text-gray-600
                                 hover:bg-gray-50 active:scale-95
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div
                      className="w-12 h-9 flex items-center justify-center
                                    border-y border-gray-200
                                    text-sm font-semibold text-gray-900
                                    select-none"
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={increment}
                      disabled={quantity >= product.stock}
                      aria-label="Aumentar cantidad"
                      className="w-9 h-9 flex items-center justify-center rounded-r-xl
                                 border border-gray-200 text-gray-600
                                 hover:bg-gray-50 active:scale-95
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs text-gray-400">
                    {product.stock} disponibles
                  </span>
                </div>

                {/* Botón carrito — 3 estados igual que ProductCard */}
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`
                    w-full flex items-center justify-center gap-2
                    py-3.5 rounded-xl font-medium text-sm
                    active:scale-[.98] transition-all duration-200
                    disabled:cursor-not-allowed
                    ${
                      added
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-900 text-white hover:bg-gray-700"
                    }
                  `}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                      Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al carrito
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
