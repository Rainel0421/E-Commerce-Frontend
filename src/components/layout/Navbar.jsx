// frontend/src/components/layout/Navbar.jsx (actualizado)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart.Context";
import { useAuth } from "../../context/auth.Context";
import {
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Search,
} from "lucide-react";
import SearchBar from "../ui/SearchBar";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const handleSearch = (query) => {
    // ✅ Siempre navega: con query actualiza la búsqueda, sin query limpia el param
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) {
      params.set("search", encodeURIComponent(query));
    } else {
      params.delete("search"); // ✅ Limpia la URL al borrar la búsqueda
    }
    navigate(`/?${params.toString()}`); // ✅ Apunta a "/" donde vive Home
    setShowSearch(false);
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initial = user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ── Logo ──────────────────────────────────────── */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 flex-shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl
                           bg-gray-900 text-white
                           transition-transform group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 hidden sm:inline">
            Shopi<span className="text-indigo-600">RD</span>
          </span>
        </Link>

        {/* ── Search Desktop ────────────────────────────── */}
        <div className="hidden md:flex flex-1 max-w-md ml-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* ── Escritorio ────────────────────────────────── */}
        <div className="hidden items-center gap-1 md:flex">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5
                         text-xs font-semibold uppercase tracking-wider
                         text-gray-400 transition-colors
                         hover:bg-gray-100 hover:text-gray-800"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          {isAdmin && user && <div className="mx-1.5 h-5 w-px bg-gray-200" />}

          {user ? (
            <div className="flex items-center gap-0.5">
              <Link
                to="/orders"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5
                           text-sm font-medium text-gray-600 transition-colors
                           hover:bg-gray-100 hover:text-gray-900"
              >
                <ShoppingCart className="h-4 w-4" />
                Mis órdenes
              </Link>

              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full
                                 bg-indigo-100 text-xs font-bold text-indigo-700">
                  {initial}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {firstName}
                </span>
              </div>

              <button
                onClick={logout}
                aria-label="Cerrar sesión"
                className="flex h-9 w-9 items-center justify-center rounded-lg
                           text-gray-400 transition-colors
                           hover:bg-gray-100 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-gray-900 px-4 py-1.5
                         text-sm font-medium text-white
                         transition-colors hover:bg-gray-700"
            >
              Iniciar sesión
            </Link>
          )}

          <CartLink itemCount={itemCount} onClick={closeMenu} />
        </div>

        {/* ── Móvil ─────────────────────────────────────── */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-xl
                       text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Search className="h-5 w-5" />
          </button>
          <CartLink itemCount={itemCount} onClick={closeMenu} />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl
                       text-gray-700 transition-colors hover:bg-gray-100"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ── Search Mobile ─────────────────────────────── */}
      {showSearch && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {/* ── Panel móvil ───────────────────────────────── */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {user && (
              <>
                <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full
                                   bg-indigo-100 text-sm font-bold text-indigo-700">
                    {initial}
                  </span>
                  <div className="text-sm leading-tight">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400">Cuenta activa</p>
                  </div>
                </div>

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5
                             text-sm font-medium text-gray-700
                             transition-colors hover:bg-gray-100"
                >
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  Mis órdenes
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5
                           text-sm font-medium text-gray-700
                           transition-colors hover:bg-gray-100"
              >
                <LayoutDashboard className="h-4 w-4 text-gray-400" />
                Panel de administración
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5
                           text-sm font-medium text-gray-700
                           transition-colors hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 text-gray-400" />
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-xl bg-gray-900 px-3 py-2.5 text-center
                           text-sm font-medium text-white
                           transition-colors hover:bg-gray-700"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function CartLink({ itemCount, onClick }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      aria-label={
        itemCount > 0
          ? `Carrito, ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`
          : "Carrito de compras"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-xl
                 text-gray-700 transition-colors hover:bg-gray-100"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5
                         flex h-5 min-w-5 items-center justify-center
                         rounded-full bg-indigo-600 px-1
                         text-xs font-semibold text-white ring-2 ring-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}