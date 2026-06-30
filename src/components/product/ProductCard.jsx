// frontend/src/components/product/ProductCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Check, ImageOff } from "lucide-react";
import { useCart } from "../../context/cart.Context";

// Componente presentacional con acceso al carrito vía contexto.
// Sigue siendo fácil de testear: basta con mockear useCart.
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock === 0;

  function handleAddToCart(e) {
    e.preventDefault(); // no navega al detalle
    e.stopPropagation(); // no dispara el Link padre
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden
                 border border-gray-100 shadow-sm
                 hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300 ease-out"
    >
      {/* ── Imagen ──────────────────────────────────────── */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover
                       group-hover:scale-[1.06] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-10 h-10 text-gray-200" strokeWidth={1} />
            <span className="text-xs text-gray-300 font-medium">
              Sin imagen
            </span>
          </div>
        )}

        {/* Degradado sutil al hacer hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />

        {/* Categoría como pill flotante */}
        {product.category?.name && (
          <span
            className="absolute top-3 left-3
                       px-2.5 py-1 rounded-full
                       bg-white/90 backdrop-blur-sm shadow-sm
                       text-[11px] font-semibold text-gray-700 tracking-wide"
          >
            {product.category.name}
          </span>
        )}

        {/* Overlay "Agotado" */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] flex items-center justify-center">
            <span
              className="px-3 py-1.5 rounded-full shadow-lg
                         bg-gray-900/90 text-white
                         text-[11px] font-bold tracking-widest uppercase"
            >
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* ── Contenido ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Botón carrito — 3 estados: normal · agregado · agotado */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            aria-label={
              added
                ? "Agregado al carrito"
                : isOutOfStock
                  ? "Producto agotado"
                  : `Agregar ${product.name} al carrito`
            }
            className={`
              w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
              transition-all duration-200 active:scale-95 disabled:cursor-not-allowed
              ${
                added
                  ? "bg-emerald-500 text-white"
                  : isOutOfStock
                    ? "bg-gray-100 text-gray-300 opacity-40"
                    : "bg-gray-100 text-gray-500 hover:bg-indigo-600 hover:text-white"
              }
            `}
          >
            {added ? (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <ShoppingCart className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
