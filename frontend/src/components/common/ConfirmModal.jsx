/**
 * Modal reutilizable para confirmaciones.
 * Recibe:
 * - open     → bool para mostrar/ocultar el modal
 * - message  → texto a mostrar
 * - onClose  → cerrar modal
 * - onConfirm → acción de confirmación
 */

export default function ConfirmModal({ open, message, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Caja del modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm z-50 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Confirmación
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
