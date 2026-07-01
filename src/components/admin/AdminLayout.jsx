// frontend/src/components/admin/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  X,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", end: false, icon: Package, label: "Productos" },
  { to: "/admin/categories", end: false, icon: Tag, label: "Categorías" },
  { to: "/admin/orders", end: false, icon: ShoppingBag, label: "Órdenes" },
];

// ── Componente NavLink reutilizable ──────────────────

function NavLinkItem({ to, end, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl
         text-sm font-medium transition-all duration-200
         ${
           isActive
             ? "bg-gray-900 text-white shadow-sm"
             : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-95 md:active:scale-100"
         }`
      }
    >
      <Icon className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ── Topbar móvil ──────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <h1 className="text-sm font-semibold text-gray-900">Admin Panel</h1>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú de navegación"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500
                     hover:text-gray-700 hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Sidebar móvil (desplegable) ───────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-black/20 backdrop-blur-[2px]">
          <nav className="absolute top-0 left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-1">
            <p className="px-3 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Navegación
            </p>
            {NAV_ITEMS.map(({ to, end, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                   text-sm font-medium transition-colors
                   ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                   }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* ── Sidebar desktop ───────────────────────────── */}
      <aside className="hidden md:flex md:flex-col md:w-52 flex-shrink-0 border-r border-gray-100 bg-white sticky top-0 h-screen">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Admin</h2>
          </div>

          <p className="px-3 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Panel admin
          </p>

          <nav className="space-y-0.5">
            {NAV_ITEMS.map(({ to, end, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                   text-sm font-medium transition-colors
                   ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                   }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────── */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        <div className="flex-1 px-4 sm:px-6 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* ── Bottom navigation (móvil) ─────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-2 py-2 flex gap-1">
        {NAV_ITEMS.map(({ to, end, icon: Icon, label }) => (
          <NavLinkItem
            key={to}
            to={to}
            end={end}
            icon={Icon}
            label={label}
            onClick={closeMobileMenu}
          />
        ))}
      </nav>
    </div>
  );
}