import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, retryPayment } from "../api/orders.api";
import {
  ArrowLeft,
  Package,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Loader2,
} from "lucide-react";

const statusConfig = {
  PENDING: {
    text: "Pendiente de pago",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  PAID: {
    text: "Pagada",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  SHIPPED: {
    text: "Enviada",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  DELIVERED: {
    text: "Entregada",
    badge: "bg-gray-50 text-gray-600 ring-gray-500/20",
    dot: "bg-gray-400",
  },
  CANCELLED: {
    text: "Cancelada",
    badge: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
};

const formatPrice = (value) =>
  `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (date) =>
  new Date(date).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setError("No se pudo cargar esta orden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleRetryPayment = async () => {
    setRetryError(null);
    setRetrying(true);
    try {
      const { checkoutUrl } = await retryPayment(order.id);
      window.location.href = checkoutUrl;
    } catch (err) {
      setRetryError(
        err.response?.data?.message || "No se pudo iniciar el pago.",
      );
      setRetrying(false);
    }
  };

  const itemCount =
    order?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <Link
        to="/orders"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium
                   text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis órdenes
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrder} />
      ) : !order ? null : (
        <>
          {/* Cabecera */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Orden{" "}
                <span className="font-mono text-[0.95em] text-gray-500">
                  #{order.id.slice(0, 8)}
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <ProductImage product={item.product} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-gray-900">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
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
              {formatPrice(order.total)}
            </span>
          </div>

          {/* Pago pendiente */}
          {order.status === "PENDING" && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Pago pendiente
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    Completa el pago para que podamos procesar y enviar tu orden.
                  </p>
                </div>
              </div>

              {retryError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {retryError}
                </div>
              )}

              <button
                onClick={handleRetryPayment}
                disabled={retrying}
                className="mt-4 flex w-full items-center justify-center gap-2
                           rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white
                           transition-colors hover:bg-gray-700
                           disabled:cursor-not-allowed disabled:opacity-60"
              >
                {retrying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirigiendo a pago...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Completar pago
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductImage({ product }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
      {product?.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <Package className="h-6 w-6 text-gray-300" />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status] ?? {
    text: status,
    badge: "bg-gray-50 text-gray-600 ring-gray-500/20",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full
                  px-3 py-1 text-sm font-medium ring-1 ring-inset ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.text}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-gray-100" />
          <div className="h-4 w-52 rounded bg-gray-100" />
        </div>
        <div className="h-7 w-24 rounded-full bg-gray-100" />
      </div>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="mt-4 h-[68px] rounded-2xl bg-gray-100" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-gray-900">
        No pudimos cargar esta orden
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