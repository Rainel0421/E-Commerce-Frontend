// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";

// Contexts (patrón Provider)
import { AuthProvider } from "./context/auth.Context";
import { CartProvider } from "./context/cart.Context";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Guards
import RequireAdmin from "./components/auth/RequireAdmin";

// Páginas públicas
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";

// Carrito y checkout
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderCancel from "./pages/OrderCancel";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            {/*
              flex flex-col → columna vertical
            min-h-screen  → mínimo toda la pantalla
            El <main> con flex-1 se estira y empuja el Footer al fondo,
            aunque el contenido sea muy corto o la página esté vacía.
          */}
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />

                {/* Carrito y checkout */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<OrderSuccess />} />
                <Route path="/checkout/cancel" element={<OrderCancel />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin (protegido) */}
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  );
}

export default App;
