import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

export default function ProductsList({ products, onEdit, onDelete }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="p-6 rounded-lg">
      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Referencia</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b border-border">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.reference}</td>
              <td className="p-3">{p.price}</td>
              <td className="p-3">{p.category.name}</td>
              <td className="p-3 flex gap-3">
                <button className="text-blue-500 font-medium" onClick={() => setSelectedProduct(p.id)}>Ver Detalles</button>
                <button className="text-pink font-medium" onClick={() => onEdit(p.id)}>Editar</button>
                <button className="text-red-400 font-medium" onClick={() => onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalles */}
      {selectedProduct && <ProductDetailsModal productId={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
