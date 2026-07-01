// frontend/src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Loader2,
  AlertCircle,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { getAllOrders } from "../../api/orders.api";

// ── Badge de estado ──────────────────────────────────

function OrderStatusBadge({ status }) {
  const STATES = {
    pending: { label: "Pendiente", cls: "bg-amber-50 text-amber-700" },
    paid: { label: "Pagado", cls: "bg-indigo-50 text-indigo-700" },
    completed: { label: "Completado", cls: "bg-emerald-50 text-emerald-700" },
    cancelled: { label: "Cancelado", cls: "bg-red-50 text-red-600" },
    shipped: { label: "Enviado", cls: "bg-blue-50 text-blue-700" },
    delivered: { label: "Entregado", cls: "bg-emerald-50 text-emerald-700" },
  };

  const config = STATES[status?.toLowerCase()] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full
                   text-xs font-semibold ${config.cls}`}
    >
      {config.label}
    </span>
  );
}

// ── Card de orden (móvil) ────────────────────────────

function OrderCard({ order, onView }) {
  const customer = order.user?.name || order.user?.email || `Orden #${order.id}`;
  const date = new Date(order.createdAt).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm
                 hover:shadow-md hover:border-gray-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {customer}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items preview */}
      {order.items && order.items.length > 0 && (
        <div className="mb-3 py-3 border-t border-b border-gray-100">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-xs text-gray-600">
                {item.quantity}× {item.product?.name || "Producto"}
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-gray-400">
                +{order.items.length - 2} más
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">
          ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
        </span>
        <button
          onClick={() => onView?.(order)}
          aria-label={`Ver orden ${order.id}`}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600
                     hover:text-indigo-700 transition"
        >
          Ver <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ── Fila de tabla (desktop) ──────────────────────────

function OrderRow({ order, onView }) {
  const customer = order.user?.name || order.user?.email || `Orden #${order.id}`;
  const date = new Date(order.createdAt).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-4 text-sm font-medium text-gray-900">
        <div className="min-w-0">
          <p className="truncate">{customer}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
      </td>

      {/* Items (visible en md+) */}
      <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-0.5">
            {order.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="text-xs">
                {item.quantity}× {item.product?.name || "Producto"}
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-gray-400">
                +{order.items.length - 2} más
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      <td className="px-5 py-4 text-sm font-semibold text-gray-900 tabular-nums">
        ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
      </td>

      <td className="px-5 py-4">
        <OrderStatusBadge status={order.status} />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          onClick={() => onView?.(order)}
          aria-label={`Ver orden ${order.id}`}
          className="text-sm font-medium text-indigo-600
                     hover:text-indigo-700 transition"
        >
          Ver
        </button>
      </td>
    </tr>
  );
}

// ── Componente principal ─────────────────────────────

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const statuses = [
    { value: "all", label: "Todas" },
    { value: "pending", label: "Pendiente" },
    { value: "paid", label: "Pagado" },
    { value: "completed", label: "Completado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const data = await getAllOrders();
        if (!active) return;
        setOrders(data);
      } catch {
        if (active) setError("No se pudieron cargar las órdenes.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  // Filtrar órdenes
  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === selectedStatus);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-gray-400 py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando órdenes…</span>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div
        className="flex items-center gap-2 text-sm text-red-700
                   bg-red-50 border border-red-100 rounded-xl px-4 py-3"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Encabezado ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center
                       justify-center flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              Órdenes
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "orden" : "órdenes"}
              {selectedStatus !== "all" && ` (${selectedStatus})`}
            </p>
          </div>
        </div>

        {/* Botón filtro (móvil) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg
                     border border-gray-200 text-sm font-medium text-gray-600
                     hover:bg-gray-50 transition"
        >
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>

      {/* ── Filtros ─────────────────────────────────── */}
      {/* Móvil: Modal de filtros */}
      {showFilters && (
        <div className="md:hidden bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Estado
            </p>
            <button
              onClick={() => setShowFilters(false)}
              aria-label="Cerrar filtros"
              className="w-5 h-5 flex items-center justify-center text-gray-400
                         hover:text-gray-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setSelectedStatus(s.value);
                  setShowFilters(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium
                           transition ${
                             selectedStatus === s.value
                               ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                               : "text-gray-600 hover:bg-gray-50"
                           }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop: Filtros en fila */}
      <div className="hidden md:flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setSelectedStatus(s.value)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition
                       ${
                         selectedStatus === s.value
                           ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                           : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                       }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Vista móvil: Grid de cards ──────────────── */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag
            className="w-12 h-12 mx-auto mb-3 text-gray-200"
            strokeWidth={1.5}
          />
          <p className="text-sm text-gray-400 mb-1">No hay órdenes</p>
          <p className="text-xs text-gray-300">
            {selectedStatus !== "all"
              ? `Intenta cambiar el filtro de estado`
              : "Las órdenes aparecerán aquí"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Cards */}
          <div className="md:hidden grid gap-3">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Desktop: Tabla */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Items
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Stats de resumen ────────────────────────── */}
      {filteredOrders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Total de órdenes
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredOrders.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Ingresos
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              $
              {filteredOrders
                .reduce((sum, o) => sum + Number(o.total ?? o.totalAmount ?? 0), 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Ticket promedio
            </p>
            <p className="text-2xl font-bold text-indigo-600">
              $
              {(
                filteredOrders.reduce(
                  (sum, o) => sum + Number(o.total ?? o.totalAmount ?? 0),
                  0
                ) / filteredOrders.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}