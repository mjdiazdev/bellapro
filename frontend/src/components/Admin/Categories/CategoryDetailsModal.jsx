import CategoryProductsDetails from "./CategoryProductsDetails";

/**
 * Componente: CategoryDetailsModal
 * --------------------------------
 * Modal que muestra los detalles de una categoría específica y sus productos.
 * 
 * Props:
 * - categoryCode: Código de la categoría a mostrar
 * - onClose: Función para cerrar el modal
 * 
 * Comportamiento:
 * - Se muestra sobre toda la pantalla con fondo semi-transparente
 * - Contiene un botón para cerrar el modal
 * - Renderiza el componente CategoryProductsDetails para mostrar la info
 */
export default function CategoryDetailsModal({ categoryCode, onClose }) {
  return (
    // Contenedor principal del modal: ocupa toda la pantalla, fondo semi-transparente
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      {/* Contenedor interno del modal: centrado, fondo blanco, bordes redondeados */}
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative">

        {/* Botón de cerrar modal, posicionado en la esquina superior derecha */}
        <button
          onClick={onClose} // Llama a la función pasada por props para cerrar el modal
          className="absolute top-4 right-4 text-red-500 font-semibold"
        >
          ✕
        </button>

        {/* Componente que muestra la información de la categoría y sus productos */}
        <CategoryProductsDetails categoryCode={categoryCode} />
      </div>
    </div>
  );
}
