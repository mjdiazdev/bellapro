import { useEffect, useState } from "react";
import { getById } from "../../../services/apiService";

/**
 * Componente: OrderDetailsModal
 * -----------------------------
 * Muestra el detalle completo de una orden en un modal.
 *
 * Incluye:
 * - Datos de facturación (cliente)
 * - Datos de envío
 * - Método de envío
 * - Productos comprados
 * - Totales con IVA
 *
 * Props:
 * - orderId: ID del pedido a consultar
 * - onClose: Función para cerrar el modal
 */
export default function OrderDetailsModal({ orderId, onClose }) {

  // Estado del pedido
  const [order, setOrder] = useState(null);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  /**
   * Cargar datos del pedido al montar o cuando cambia orderId
   */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // Llamada a la API → GET /orders/{id}
        const res = await getById("orders", orderId);

        // Guardamos el pedido completo
        setOrder(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Estados de carga / error
  if (loading) return <div className="p-6">Cargando...</div>;
  if (!order) return <div className="p-6">Pedido no encontrado</div>;

  /* ============================
     CÁLCULOS DE PRECIOS
     ============================ */

  const subtotal      = Number(order.subtotal);
  const shipping      = Number(order.shipping_price);
  const discount      = Number(order.discount_amount) || 0;
  const baseImponible = subtotal + shipping - discount;
  const iva           = baseImponible * 0.21;
  const totalConIva   = baseImponible + iva;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> {/* Añadido p-4 para que el modal no toque los bordes del navegador */}

      {/* Contenedor del modal con Scroll y Altura Máxima */}
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] flex flex-col relative overflow-hidden shadow-2xl">

        {/* Botón cerrar - Lo mantenemos arriba a la derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 font-semibold z-10 bg-white/80 p-1 rounded-full"
        >
          ✕
        </button>

        {/* Contenedor con Scroll: Aquí envolvemos todo el contenido */}
        <div className="p-6 overflow-y-auto">
          
          {/* Título */}
          <h1 className="text-2xl font-bold mb-6">
            Pedido #{order.id}
          </h1>

          {/* FACTURACIÓN / ENVÍO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos de facturación */}
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold text-gray-700 mb-3">Datos de facturación</h2>
              <p><strong>Nombre:</strong> {order.customer?.name}</p>
              <p><strong>NIF:</strong> {order.customer?.nif}</p>
              <p><strong>Email:</strong> {order.customer?.email}</p>
              <p><strong>Teléfono:</strong> {order.customer?.phone}</p>
              <p className="mt-2">
                <strong>Dirección:</strong> {order.customer?.address} {order.customer?.address_extra}
              </p>
              <p>
                <strong>Ubicación:</strong> {order.postal_code?.code}, {order.postal_code?.city?.name}, {order.postal_code?.city?.province?.name}
              </p>
            </div>

            {/* Datos de envío */}
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold text-gray-700 mb-3">Datos de envío</h2>
              <p><strong>Nombre:</strong> {order.delivery_name}</p>
              <p><strong>NIF:</strong> {order.delivery_nif}</p>
              <p><strong>Teléfono:</strong> {order.delivery_phone}</p>
              <p className="mt-2">
                <strong>Dirección:</strong> {order.delivery_address} {order.delivery_address_extra}
              </p>
              <p>
                <strong>Ubicación:</strong> {order.postal_code?.code}, {order.postal_code?.city?.name}, {order.postal_code?.city?.province?.name}
              </p>
            </div>
          </div>

          {/* MÉTODO DE ENVÍO Y LOGÍSTICA */}
          <div className="mt-6 border rounded-lg p-4 bg-gray-50">
            <h2 className="font-semibold text-gray-700 mb-2">Información Logística</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Servicio de entrega</p>
                <p className="font-medium">{order.distribution_center_method?.shipping_method?.name || "No especificado"}</p>
                <p className="text-sm text-gray-600">{order.distribution_center_method?.shipping_method?.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Centro de Distribución</p>
                <p className="font-medium text-pink-600">{order.distribution_center_method?.distribution_center?.name || "Pendiente de asignación"}</p>
                <p className="text-sm text-gray-600">Tel: {order.distribution_center_method?.distribution_center?.phone}</p>
              </div>
            </div>
            <p className="mt-3 pt-2 border-t border-gray-200"><strong>Coste de envío:</strong> {Number(order.shipping_price).toFixed(2)}€</p>
          </div>

          {/* PRODUCTOS */}
          <h2 className="font-semibold text-gray-700 mt-6">Productos</h2>
          {/* Envolvemos la tabla en un div con scroll horizontal para móviles */}
          <div className="overflow-x-auto mt-2 border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 whitespace-nowrap">Producto</th>
                  <th className="p-2 whitespace-nowrap">Referencia</th>
                  <th className="p-2 whitespace-nowrap">Cantidad</th>
                  <th className="p-2 whitespace-nowrap">Precio unitario</th>
                  <th className="p-2 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 min-w-[150px]">{item.product.name}</td>
                    <td className="p-2">{item.product.reference}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2">{Number(item.unit_price).toFixed(2)}€</td>
                    <td className="p-2">{Number(item.total_price).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div className="mt-6 flex flex-col items-end space-y-1">
            <p>Subtotal: {subtotal.toFixed(2)}€</p>
            <p>Envío: {shipping.toFixed(2)}€</p>
            {discount > 0 && (
              <p className="text-pink-600 font-medium">Descuento cupón: -{discount.toFixed(2)}€</p>
            )}
            <p>Base imponible: {baseImponible.toFixed(2)}€</p>
            <p>IVA (21%): {iva.toFixed(2)}€</p>
            <p className="font-bold text-lg">Total: {totalConIva.toFixed(2)}€</p>
          </div>

          {/* Estado del pedido */}
          <p className="mt-2 text-gray-500 text-right pb-4">
            Estado: <span className="capitalize">{order.status}</span>
          </p>
        </div> {/* Fin del scroll container */}
      </div>
    </div>
  );
}
