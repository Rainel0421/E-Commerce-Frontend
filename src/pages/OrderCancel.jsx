// frontend/src/pages/OrderCancel.jsx
import { Link } from "react-router-dom";

export default function OrderCancel() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Pago cancelado</h1>
      <p className="text-gray-500 mb-6">
        No te preocupes, tu carrito sigue intacto.
      </p>
      <Link to="/cart" className="text-black underline">
        Volver al carrito
      </Link>
    </div>
  );
}
