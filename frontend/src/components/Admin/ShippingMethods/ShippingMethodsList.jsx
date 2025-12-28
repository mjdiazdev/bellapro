// src/components/Admin/ShippingMethods/ShippingMethodsList.jsx

/**
 * Componente: ShippingMethodsList
 * -------------------------------
 * Renderiza la tabla de métodos de envío.
 *
 * Props:
 * - shippingMethods: Array [{ id, name, description, price }]
 * - onEdit: función para editar
 * - onDelete: función para eliminar
 */
export default function ShippingMethodsList({ shippingMethods, onEdit, onDelete }) {
  return (
    <div className="p-6 rounded-lg">
      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {shippingMethods.map((method) => (
            <tr key={method.id} className="border-b border-border">
              <td className="p-3">{method.name}</td>
              <td className="p-3">{method.description}</td>
              <td className="p-3 font-medium">
                ${Number(method.price).toFixed(2)}
              </td>

              <td className="p-3 flex gap-3">
                <button
                  className="text-pink font-medium"
                  onClick={() => onEdit(method.id)}
                >
                  Editar
                </button>

                <button
                  className="text-red-400 font-medium"
                  onClick={() => onDelete(method.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
