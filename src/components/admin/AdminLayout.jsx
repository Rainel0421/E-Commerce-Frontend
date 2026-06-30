// frontend/src/components/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',   end: true,  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/products',   end: false, icon: Package,         label: 'Productos'  },
  { to: '/admin/categories', end: false, icon: Tag,             label: 'Categorías' },
  { to: '/admin/orders',     end: false, icon: ShoppingBag,     label: 'Órdenes'    },
];

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="w-52 flex-shrink-0">
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
                 ${isActive
                   ? 'bg-gray-900 text-white'
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                 }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── Contenido ─────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}