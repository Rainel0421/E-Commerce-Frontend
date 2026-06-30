
import { useState, useEffect } from 'react';
import { getAllOrders } from '../../api/orders.api';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch {
        setError('No se pudieron cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Órdenes</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No hay órdenes todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2">Cliente</th>
              <th className="py-2">Items</th>
              <th className="py-2">Total</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 align-top">
                <td className="py-3">
                  <div>{order.user?.name}</div>
                  <div className="text-gray-400 text-xs">{order.user?.email}</div>
                </td>
                <td className="py-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-gray-600">
                      {item.quantity}× {item.product?.name}
                    </div>
                  ))}
                </td>
                <td className="py-3 font-medium">${Number(order.total).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}