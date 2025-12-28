import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrdersList({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-6 rounded-lg">
      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Email</th>
            <th className="p-3">Total</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.delivery_name}</td>
              <td className="p-3">{o.delivery_email}</td>
              <td className="p-3">€{Number(o.total).toFixed(2)}</td>
              <td className="p-3 capitalize">{o.status}</td>
              <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
              <td className="p-3 flex gap-3">
                <button
                  className="text-blue-500 font-medium"
                  onClick={() => setSelectedOrder(o.id)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
