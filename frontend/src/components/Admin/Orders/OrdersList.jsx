import { useState } from "react";
import AdminTable from "../../common/AdminTable";
import OrderDetailsModal from "./OrderDetailsModal";
// Importar iconos
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function OrdersList({ orders, onBulkStatusChange }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const columns = [
    {
      header: (
        <input 
          type="checkbox" 
          onChange={toggleSelectAll} 
          checked={orders.length > 0 && selectedIds.length === orders.length}
          className="w-4 h-4 accent-pink-500 cursor-pointer"
        />
      ),
      key: 'selection',
      render: (o) => (
        <input 
          type="checkbox" 
          checked={selectedIds.includes(o.id)}
          onChange={() => toggleSelect(o.id)}
          className="w-4 h-4 accent-pink-500 cursor-pointer"
        />
      )
    },
    { header: 'ID', key: 'id' },
    { header: 'Cliente', key: 'delivery_name' },
    { 
      header: 'Total', 
      key: 'total',
      render: (o) => <span className="font-medium text-gray-700">€{Number(o.total).toFixed(2)}</span>
    },
    { 
      header: 'Estado', 
      key: 'status',
      render: (o) => {
        // Mapeo de estilos, textos e iconos
        const statusConfig = {
          completed: {
            text: "Completado",
            classes: "bg-green-100 text-green-700 border-green-200",
            icon: <CheckCircle size={14} className="mr-1" />
          },
          pending: {
            text: "Pendiente",
            classes: "bg-amber-100 text-amber-700 border-amber-200",
            icon: <Clock size={14} className="mr-1" />
          },
          canceled: {
            text: "Anulado",
            classes: "bg-red-100 text-red-700 border-red-200",
            icon: <XCircle size={14} className="mr-1" />
          },
          default: {
            text: o.status,
            classes: "bg-gray-100 text-gray-700 border-gray-200",
            icon: null
          }
        };

        const config = statusConfig[o.status] || statusConfig.default;

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.classes}`}>
            {config.icon}
            {config.text}
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
          <span className="text-xs text-gray-400">{new Date(o.created_at).toLocaleTimeString()}</span>
        </div>
      )
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
        
        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-3 bg-pink text-white p-2 rounded-lg shadow-md animate-in fade-in slide-in-from-top-2">
            <span className="text-xs text-white font-bold ml-2">
              {selectedIds.length} SELECCIONADOS:
            </span>
            <select 
              className="bg-pink text-white text-xs border-none rounded md:p-1 focus:ring-1 focus:ring-white outline-none cursor-pointer"
              onChange={(e) => {
                onBulkStatusChange(selectedIds, e.target.value);
                setSelectedIds([]);
              }}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-800 bg-white">Cambiar estado a...</option>
              <option value="pending" className="text-gray-800 bg-white">Pendiente</option>
              <option value="completed" className="text-gray-800 bg-white">Completado</option>
              <option value="canceled" className="text-gray-800 bg-white">Anulado</option>
            </select>
          </div>
        )}
      </div>

      <AdminTable 
        columns={columns}
        data={orders}
        onView={(o) => setSelectedOrder(o.id)}
      />

      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}