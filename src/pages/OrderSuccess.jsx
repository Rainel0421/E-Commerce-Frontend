// frontend/src/pages/OrderSuccess.jsx
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/cart.Context";

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const [params] = useSearchParams();
  const orderId = params.get("order");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">

        {/* ICONO SUCCESS (sin cambiar colores base) */}
        <div className="mx-auto mb-6 h-16 w-16 rounded-full border border-gray-200 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* TITULO */}
        <h1 className="text-2xl font-bold mb-2 text-black">
          ¡Gracias por tu compra! 🎉
        </h1>

        {/* SUBTITULO */}
        <p className="text-gray-500 mb-8 leading-relaxed">
          Tu pago está siendo confirmado. En breve recibirás los detalles de tu pedido.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-1">Orden</p>
            <span className="inline-block border border-gray-200 px-3 py-1 rounded-md text-sm text-gray-700">
              #{orderId}
            </span>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link
              to={`/orders/${orderId}`}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Ver detalle de esta orden
            </Link>
          )}

          <Link
            to="/orders"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium text-black hover:bg-gray-50 transition"
          >
            Ver todas mis órdenes
          </Link>
        </div>

        {/* CTA SECUNDARIO */}
        <Link
          to="/"
          className="block mt-6 text-sm text-gray-500 underline hover:text-gray-700"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}