import { useState } from "react";
import CategoryDetailsModal from "./CategoryDetailsModal";

/**
 * Componente: CategoriesList
 * -------------------------
 * Renderiza una tabla con la lista de categorías.
 * Cada fila tiene acciones: Editar, Eliminar, Ver Detalles.
 * 
 * Props:
 * - categories: Array de objetos categoría [{id, name, code, ...}]
 * - onEdit: Función que recibe un id y abre el modal de edición
 * - onDelete: Función que recibe un id y abre el modal de confirmación de eliminación
 */
export default function CategoriesList({ categories, onEdit, onDelete }) {
  // Estado local para la categoría seleccionada para ver detalles
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="p-6 rounded-lg">
      
      {/* Tabla de categorías */}
      <table className="w-full text-left rounded-lg overflow-hidden">
        {/* Cabecera */}
        <thead className="bg-gray-700 text-gray-50">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Código</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-border">
              
              {/* Nombre de la categoría */}
              <td className="p-3">{cat.name}</td>

              {/* Código de la categoría */}
              <td className="p-3">{cat.code}</td>

              {/* Botones de acción */}
              <td className="p-3 flex gap-3">
                
                {/* Botón Editar */}
                <button
                  className="text-pink font-medium"
                  onClick={() => onEdit(cat.id)} // Llama al modal de edición
                >
                  Editar
                </button>

                {/* Botón Eliminar */}
                <button
                  className="text-red-400 font-medium"
                  onClick={() => onDelete(cat.id)} // Llama al modal de confirmación
                >
                  Eliminar
                </button>

                {/* Botón Ver Detalles */}
                <button
                  className="text-blue-500 font-medium"
                  onClick={() => setSelectedCategory(cat.code)} // Abre modal de detalles
                >
                  Ver Detalles
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalles de categoría */}
      {selectedCategory && (
        <CategoryDetailsModal
          categoryCode={selectedCategory} // Pasamos el código para la API
          onClose={() => setSelectedCategory(null)} // Cierra el modal
        />
      )}
    </div>
  );
}
