// frontend/src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Truck, ShieldCheck, Mail } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const NAV_SECTIONS = [
  {
    label: "Tienda",
    links: [
      { to: "/", text: "Inicio" },
      { to: "/", text: "Todos los productos" },
      { to: "/", text: "Categorías" },
      { to: "/", text: "Ofertas" },
    ],
  },
  {
    label: "Cuenta",
    links: [
      { to: "/login", text: "Iniciar sesión" },
      { to: "/register", text: "Crear cuenta" },
      { to: "/cart", text: "Mi carrito" },
      { to: "/orders", text: "Mis pedidos" },
    ],
  },
  {
    label: "Soporte",
    links: [
      { to: "/", text: "Centro de ayuda" },
      { to: "/", text: "Contacto" },
      { to: "/", text: "Envíos" },
      { to: "/", text: "Devoluciones" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* ── TRUST STRIP ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck className="w-5 h-5 text-indigo-600" />
            Envíos rápidos a todo el país
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Pagos 100% seguros
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Heart className="w-5 h-5 text-red-500" />
            Soporte humano y cercano
          </div>
        </div>

        {/* ── MAIN GRID ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* BRAND */}
          <div className="md:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white group-hover:scale-105 transition">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                Shopi<span className="text-indigo-600">RD</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Una experiencia de compra moderna, rápida y segura. Productos
              seleccionados para mejorar tu día a día.
            </p>

            {/* NEWSLETTER */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Suscríbete a ofertas exclusivas
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center w-full border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full ml-2 outline-none text-sm"
                  />
                </div>

                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition">
                  Unirme
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Sin spam. Solo ofertas reales.
              </p>
            </div>
          </div>

          {/* LINKS */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
                {section.label}
              </p>

              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={`${section.label}-${index}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── SOCIAL + BOTTOM BAR ───────────────────── */}
        <div className="mt-14 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500">
            © {year} Mi Tienda. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-gray-500">
            <FaInstagram className="w-4 h-4 hover:text-gray-900 cursor-pointer transition" />
            <FaFacebook className="w-4 h-4 hover:text-gray-900 cursor-pointer transition" />
            <FaTwitter className="w-4 h-4 hover:text-gray-900 cursor-pointer transition" />
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            Hecho con <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            en República Dominicana
          </p>
        </div>
      </div>
    </footer>
  );
}