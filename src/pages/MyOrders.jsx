import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders.api";
import {
  Package,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  RefreshCw,
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

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      setError("Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Mis órdenes
        </h1>
        {!loading && !error && orders.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "orden" : "órdenes"} en total
          </p>
        )}
      </header>

      {loading ? (
        <OrdersSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const preview = order.items
    .slice(0, 2)
    .map((i) => `${i.quantity}× ${i.product?.name ?? "Producto"}`)
    .join("  ·  ");

  const remaining = order.items.length - 2;

  return (
    <Link
      to={`/orders/${order.id}`}
      className="group block rounded-2xl border border-gray-100 bg-white p-5
                 transition-all hover:border-gray-300 hover:shadow-sm
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold tracking-tight text-gray-900">
            Orden{" "}
            <span className="font-mono text-[0.95em] text-gray-500">
              #{order.id.slice(0, 8)}
            </span>
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-4 truncate text-sm text-gray-600">
        {preview}
        {remaining > 0 && (
          <span className="text-gray-400"> · +{remaining} más</span>
        )}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(order.total)}
          </span>
          <ChevronRight
            className="h-4 w-4 text-gray-300 transition-all
                       group-hover:translate-x-0.5 group-hover:text-gray-500"
          />
        </div>
      </div>
    </Link>
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
                  px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.text}
    </span>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-100" />
              <div className="h-3 w-40 rounded bg-gray-100" />
            </div>
            <div className="h-6 w-24 rounded-full bg-gray-100" />
          </div>
          <div className="mt-4 h-3 w-2/3 rounded bg-gray-100" />
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="h-3 w-20 rounded bg-gray-100" />
            <div className="h-5 w-24 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
        <Package className="h-7 w-7 text-gray-400" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-gray-900">
        Aún no tienes órdenes
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        Cuando hagas tu primera compra aparecerá aquí, y podrás seguir su estado
        en todo momento.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900
                   px-5 py-2.5 text-sm font-medium text-white
                   transition-colors hover:bg-gray-700"
      >
        <ShoppingBag className="h-4 w-4" />
        Explorar productos
      </Link>
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
        No pudimos cargar tus órdenes
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
