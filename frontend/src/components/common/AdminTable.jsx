import { useState, useMemo } from 'react';
import { Edit, Trash2, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './variant/Button';

export default function AdminTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView, 
  customActions = [], 
  isEditable = false, 
  onSaveAll,
  rowsPerPage = 10 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Lógica de Filtrado Global
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 2. Lógica de Paginación
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const actionBtnClass = "p-2 text-white rounded-pill bg-primary-gradient hover:bg-primary-gradient-hover shadow-primary-btn transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center";

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar en esta lista..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-pill focus:outline-none focus:border-pink transition-colors shadow-sm"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {isEditable && (
          <Button onClick={onSaveAll} width="220px">
            Guardar cambios realizados
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-gray-600 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-pink text-white">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className="p-4 font-semibold uppercase text-sm tracking-wider border-b border-gray-700"
                >
                  {col.header}
                </th>
              ))}
              <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center border-b border-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, index) => (
                  <td key={index} className="p-3 text-gray-800 border-r border-gray-300 last:border-r-0">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                <td className="p-4 flex justify-center gap-3">
                  {onView && <button onClick={() => onView(item)} className={actionBtnClass} title="Ver detalles"><Eye size={18} /></button>}
                  {onEdit && <button onClick={() => onEdit(item.id)} className={actionBtnClass} title="Editar"><Edit size={18} /></button>}
                  {onDelete && <button onClick={() => onDelete(item.id)} className={actionBtnClass} title="Eliminar"><Trash2 size={18} /></button>}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-10 text-center text-gray-400 italic">
                  No se encontraron resultados para su búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-gray-400 text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            <span className="text-gray-700 text-sm">
              Página <span className="font-bold text-pink">{currentPage}</span> de {totalPages}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-gray-400 text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}