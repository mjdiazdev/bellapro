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

  const actionBtnClass = "p-2 text-white rounded-pill bg-primary-gradient hover:bg-primary-gradient-hover shadow-primary-btn transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center";

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="space-y-4">
      {/* 1. Ajuste en el buscador: flex-col en móvil, row en desktop */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-pill focus:border-pink transition-colors shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isEditable && (
          <Button onClick={onSaveAll} width="220px">
            Guardar cambios realizados
          </Button>
        )}
      </div>

      {/* 2. Contenedor con overflow-x-auto para permitir el scroll lateral */}
      <div className="rounded-lg border border-gray-600 overflow-x-auto shadow-sm">
        
        {/* 3. min-w-[800px]: Esto obliga a la tabla a no "aplastarse" en móviles, activando el scroll */}
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead className="bg-pink text-white">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="p-4 font-semibold uppercase text-sm tracking-wider border-b border-gray-700">
                  {col.header}
                </th>
              ))}
              <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center border-b border-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-400 hover:bg-gray-50 transition-colors">
                {columns.map((col, index) => (
                  <td key={index} className="p-3 text-gray-800 border-r border-gray-300 last:border-r-0">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                
                {/* 4. flex y justify-center en las acciones */}
                <td className="p-4 flex justify-center gap-3">
                  {onView && <button onClick={() => onView(item)} className={actionBtnClass} title="Ver detalles"><Eye size={18} /></button>}
                  {onEdit && <button onClick={() => onEdit(item.id)} className={actionBtnClass} title="Editar"><Edit size={18} /></button>}
                  {onDelete && <button onClick={() => onDelete(item.id)} className={actionBtnClass} title="Eliminar"><Trash2 size={18} /></button>}
                </td>
              </tr>
            ))}
            
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-10 text-center text-gray-400 italic">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}