import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.Context";
import { useAuth } from "../context/auth.Context";
import { getCartSummary } from "../api/cart.api";
import { createCheckout } from "../api/orders.api";
import {
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const formatPrice = (value) =>
  `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Checkout() {
  const { items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payError, setPayError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCartSummary(items);
      setSummary(data);
    } catch {
      setError("No se pudo validar el carrito. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    fetchSummary();
  }, [items, navigate, fetchSummary]);

  const handlePay = async () => {
    // Si no está logueado, lo mandamos a login y luego de vuelta aquí
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }

    setPayError(null);
    setProcessingPayment(true);
    try {
      const { checkoutUrl } = await createCheckout(items);
      window.location.href = checkoutUrl; // Stripe toma el control desde aquí
    } catch (err) {
      setPayError(
        err.response?.data?.message || "No se pudo iniciar el pago.",
      );
      setProcessingPayment(false);
    }
  };

  const itemCount = summary
    ? summary.items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        Resumen de tu compra
      </h1>

      {loading ? (
        <CheckoutSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSummary} />
      ) : !summary ? null : (
        <>
          {/* Problemas del carrito */}
          {summary.issues.length > 0 && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Revisa tu carrito
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-amber-700">
                    {summary.issues.map((issue) => (
                      <li key={issue.productId} className="flex gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/cart")}
                    className="mt-3 text-sm font-medium text-amber-800 underline-offset-2 hover:underline"
                  >
                    Volver al carrito
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="divide-y divide-gray-100">
              {summary.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-1.5 text-sm">
                    <span className="truncate text-gray-700">{item.name}</span>
                    <span className="shrink-0 text-gray-400">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-gray-900">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xs text-gray-400">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </p>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {formatPrice(summary.total)}
            </span>
          </div>

          {/* Error de pago (inline, sin perder el resumen) */}
          {payError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {payError}
            </div>
          )}

          {/* Botón de pago */}
          <button
            onClick={handlePay}
            disabled={!summary.valid || processingPayment}
            className="mt-4 flex w-full items-center justify-center gap-2
                       rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-medium text-white
                       transition-colors hover:bg-gray-700
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            {processingPayment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirigiendo a pago...
              </>
            ) : !user ? (
              <>
                <LogIn className="h-4 w-4" />
                Iniciar sesión para continuar
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pagar con Stripe
              </>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Lock className="h-3 w-3" />
            Pago seguro procesado por Stripe
          </p>
        </>
      )}
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <div className="h-4 w-40 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>
      <div className="mt-4 h-[68px] rounded-2xl bg-gray-100" />
      <div className="mt-4 h-[54px] rounded-xl bg-gray-100" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-gray-900">
        No pudimos validar tu carrito
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200
                   px-5 py-2.5 text-sm font-medium text-gray-700
                   transition-colors hover:bg-gray-50"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  );
}