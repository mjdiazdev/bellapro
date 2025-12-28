/**
 * Modal genérico para formularios o contenido personalizado
 * Props:
 * - open
 * - title
 * - children (contenido interno)
 * - onClose
 */

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg z-50 animate-fade-in">

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>

        {/* Contenido dinámico */}
        {children}

        {/* Footer (solo botón cerrar por defecto) */}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
