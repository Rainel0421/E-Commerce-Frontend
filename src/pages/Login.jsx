// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "../context/auth.Context";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas.");
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ── Branding ──────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Bienvenido de vuelta
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>

        {/* ── Card del formulario ───────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full text-sm border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5
                             placeholder:text-gray-300
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                             transition"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full text-sm border border-gray-200 rounded-xl pl-10 pr-10 py-2.5
                             placeholder:text-gray-300
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400
                             transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2
                         bg-gray-900 text-white rounded-xl py-2.5 mt-2
                         text-sm font-medium hover:bg-gray-700 active:scale-[.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

         
        </div>

        {/* ── Registro ──────────────────────────────────── */}
        <p className="mt-5 text-sm text-gray-400 text-center">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}