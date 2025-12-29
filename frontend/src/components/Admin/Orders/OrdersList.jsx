import { useState } from "react";
import AdminTable from "../../common/AdminTable";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrdersList({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Configuración de columnas para Pedidos
  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Cliente', key: 'delivery_name' },
    { header: 'Email', key: 'delivery_email' },
    { 
      header: 'Total', 
      key: 'total',
      render: (o) => (
        <span>
          €{Number(o.total).toFixed(2)}
        </span>
      )
    },
    { 
      header: 'Estado', 
      key: 'status',
      render: (o) => {
        // Lógica de colores según el estado
        const statusStyles = {
          completed: "bg-green-400 border-green-500/50",
          pending: "bg-amber-400 border-amber-400",
          cancelled: "bg-red-400 border-red-500/50",
          default: "bg-gray-400 border-gray-600"
        };
        const style = statusStyles[o.status] || statusStyles.default;

        return (
          <span className={`px-2 py-1 rounded text-xs font-bold border ${style}`}>
            {o.status}
          </span>
        );
      }
    },
    { 
      header: 'Fecha', 
      key: 'created_at',
      render: (o) => (
        <div className="text-sm">
          {new Date(o.created_at).toLocaleDateString()} <br/>
          <span className="text-xs">{new Date(o.created_at).toLocaleTimeString()}</span>
        </div>
      )
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Gestión de Pedidos</h1>

      {/* 2. AdminTable solo con onView (Pedidos no suelen borrarse o editarse así de simple) */}
      <AdminTable 
        columns={columns}
        data={orders}
        onView={(o) => setSelectedOrder(o.id)}
      />

      {/* 3. Modal de detalles */}
      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}