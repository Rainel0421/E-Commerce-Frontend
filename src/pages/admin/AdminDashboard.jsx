// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Tag,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Loader2,
  ImageOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getProducts } from "../../api/products.api";
import { getCategories } from "../../api/categories.api";
import { getAllOrders } from "../../api/orders.api";

// ── Componentes internos ─────────────────────────────────

function StatCard({ icon: Icon, label, value, colorIcon, colorBg, to }) {
  return (
    <Link
      to={to}
      className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorBg}`}>
          <Icon className={`w-5 h-5 ${colorIcon}`} />
        </div>
        <ArrowRight
          className="w-4 h-4 text-gray-200 group-hover:text-gray-400
                     group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900 tracking-tight leading-none">
        {value ?? "—"}
      </p>
      <p className="mt-1.5 text-sm text-gray-400">{label}</p>
    </Link>
  );
}

function OrderStatusBadge({ status }) {
  const STATES = {
    pending:   { label: "Pendiente",  cls: "bg-amber-50   text-amber-700"   },
    paid:      { label: "Pagado",     cls: "bg-indigo-50  text-indigo-700"  },
    completed: { label: "Completado", cls: "bg-emerald-50 text-emerald-700" },
    cancelled: { label: "Cancelado",  cls: "bg-red-50     text-red-600"     },
  };
  const { label, cls } = STATES[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full
                      text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function SectionError({ message }) {
  return (
    <div className="flex items-center gap-2 m-4 px-4 py-3 rounded-xl
                    bg-red-50 border border-red-100 text-sm text-red-700">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  );
}

// ── Dashboard principal ──────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      // allSettled: si una API falla las otras siguen funcionando
      const [productsRes, categoriesRes, ordersRes] = await Promise.allSettled([
        getProducts(),
        getCategories(),
        getAllOrders(),
      ]);
      if (!active) return;

      const products    = productsRes.status   === "fulfilled" ? productsRes.value   : [];
      const categories  = categoriesRes.status === "fulfilled" ? categoriesRes.value : [];
      const orders      = ordersRes.status     === "fulfilled" ? ordersRes.value     : [];
      const ordersError = ordersRes.status === "rejected";

      const revenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.total ?? o.totalAmount ?? 0), 0);

      const lowStock = [...products]
        .filter((p) => p.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setData({
        productCount:  products.length,
        categoryCount: categories.length,
        orderCount:    ordersError ? null : orders.length,
        revenue:       ordersError ? null : revenue,
        lowStock,
        recentOrders,
        ordersError,
      });
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-gray-400 py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando dashboard…</span>
      </div>
    );
  }

  const STATS = [
    {
      icon: Package,
      label: "Productos",
      value: data.productCount,
      colorIcon: "text-indigo-600",
      colorBg:   "bg-indigo-50",
      to: "/admin/products",
    },
    {
      icon: Tag,
      label: "Categorías",
      value: data.categoryCount,
      colorIcon: "text-violet-600",
      colorBg:   "bg-violet-50",
      to: "/admin/categories",
    },
    {
      icon: ShoppingBag,
      label: "Pedidos",
      value: data.orderCount,
      colorIcon: "text-sky-600",
      colorBg:   "bg-sky-50",
      to: "/admin/orders",
    },
    {
      icon: TrendingUp,
      label: "Ingresos totales",
      value: data.revenue !== null
        ? `$${data.revenue.toLocaleString("es-DO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : null,
      colorIcon: "text-emerald-600",
      colorBg:   "bg-emerald-50",
      to: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Encabezado ──────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Resumen general de tu tienda
        </p>
      </div>

      {/* ── KPIs ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Sección inferior ────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Pedidos recientes */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Pedidos recientes
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-medium text-gray-400
                         hover:text-indigo-600 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {data.ordersError ? (
            <SectionError message="No se pudieron cargar los pedidos. El servidor devolvió un error." />
          ) : data.recentOrders.length === 0 ? (
            <div className="py-14 text-center text-sm text-gray-400">
              No hay pedidos todavía
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3
                             hover:bg-gray-50/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.user?.name ?? order.user?.email ?? `Pedido #${order.id}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("es-DO", {
                        day:   "numeric",
                        month: "short",
                        year:  "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                      ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stock bajo */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Stock bajo</h2>
              {data.lowStock.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold
                                 bg-amber-50 text-amber-700">
                  {data.lowStock.length}
                </span>
              )}
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-medium text-gray-400
                         hover:text-indigo-600 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {data.lowStock.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-300" strokeWidth={1.5} />
              Todo el stock está en buen nivel
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {data.lowStock.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between px-5 py-3
                             hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100
                                    flex items-center justify-center flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.5} />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                  </div>

                  <span className={`flex-shrink-0 ml-4 px-2 py-0.5 rounded-full
                                    text-[11px] font-semibold
                                    ${product.stock === 0
                                      ? "bg-red-50 text-red-600"
                                      : "bg-amber-50 text-amber-700"
                                    }`}>
                    {product.stock === 0 ? "Agotado" : `${product.stock} unid.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}