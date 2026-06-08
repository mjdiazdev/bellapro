import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import Button from './variant/Button';

export default function AdminTable({
  columns,
  data = [],
  onEdit,
  onDelete,
  onView,
  isEditable = false,
  onSaveAll
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="space-y-4">

      {/* Buscador + botón guardar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 shadow-sm bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isEditable && (
          <Button onClick={onSaveAll} width="220px">
            Guardar cambios realizados
          </Button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-pink text-white text-xs uppercase tracking-wide">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-6 py-3 text-left font-semibold">
                    {col.header}
                  </th>
                ))}
                {(onView || onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right font-semibold">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, index) => (
                    <td key={index} className="px-6 py-4 text-gray-700">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            title="Ver detalles"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item.id)}
                            title="Editar"
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            title="Eliminar"
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-10 text-center text-gray-400 text-sm italic"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
