export default function PaginationControls({ 
  currentPage, lastPage, perPage, setPerPage, setCurrentPage, from, to, total, onlySelector = false 
}) {
  if (onlySelector) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 p-2 rounded-lg w-fit mb-4">
        <span>Mostrar</span>
        <select 
          className="border-none bg-transparent font-bold text-gray-800 cursor-pointer focus:ring-0"
          value={perPage} 
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[10, 25, 50, 100, 250].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span>registros</span>
      </div>
    );
  }

  // Si no hay más de una página, podrías ocultar los botones pero dejar el texto informativo
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-4 gap-4">
      <p className="text-sm text-gray-500">
        Mostrando {from || 0} a {to || 0} de {total || 0} productos
      </p>
      
      {lastPage > 1 && (
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-30 bg-white hover:bg-gray-50 transition-colors"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-30 bg-white hover:bg-gray-50 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}