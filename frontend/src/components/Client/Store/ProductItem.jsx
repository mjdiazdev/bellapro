import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductItem({ product, onAdd, onRemove, onStockAlert, isMatch, id }) {
  // Evitamos errores si el objeto product no llega correctamente
  if (!product) return null;

  const safeId = id || ""; 
  const currentQty = product.quantity || 0; 
  const stockAvailable = product.stock || 0;
  
  // LÓGICA DE ESTADOS
  // 1. ¿No hay nada en bodega?
  const isTotallyEmpty = stockAvailable <= 0;
  
  // 2. ¿El usuario ya alcanzó el tope en su carrito?
  const isLimitReached = currentQty >= stockAvailable;

  const handleAddClick = () => {
    // Si el stock real es 0
    if (isTotallyEmpty) {
      onStockAlert(
        "Producto Agotado", 
        `Lo sentimos, el producto "${product.name}" no tiene existencias disponibles.`
      );
      return;
    }

    // Si intenta agregar más de lo que hay en stock
    if (isLimitReached) {
      onStockAlert(
        "Límite de Stock", 
        `Solo tenemos ${stockAvailable} unidades disponibles de "${product.name}".`
      );
      return;
    }

    onAdd();
  };

  return (
    <div 
      id={safeId} 
      className={`w-full p-4 flex items-center justify-between mb-4 transition-all duration-500 border-b py-6 rounded-xl relative
        ${isTotallyEmpty ? 'opacity-70 grayscale-[0.5]' : 'opacity-100'} 
        ${isMatch ? 'bg-pink-100 border-pink shadow-md scale-[1.02] ring-2 ring-pink/20' : 'bg-transparent border-gray-200'}
      `}
    >
      
      {/* Sección Izquierda: Imagen + Detalles */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-20 h-20 rounded-lg object-cover border transition-all ${isMatch ? 'border-pink' : 'border-gray-50'}`}
          />
          
          {/* ETIQUETA SIN STOCK: Solo se muestra si el stock real de base de datos es 0 */}
          {isTotallyEmpty && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              <span className="text-white text-[10px] font-black uppercase tracking-tighter text-center px-1">
                Sin Stock
              </span>
            </div>
          )}

          {isMatch && !isTotallyEmpty && (
            <span className="absolute -top-2 -left-2 bg-pink text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
              ¡Aquí!
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className={`text-lg font-bold leading-tight transition-colors ${isMatch ? 'text-gray-900' : 'text-pink'}`}>
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            {product.size || ''} · <span className="opacity-70">Ref:{product.reference}</span>
          </p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            €{product.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sección Derecha: Controles de cantidad */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <button 
          onClick={handleAddClick} 
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border 
            ${isLimitReached 
              ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-pink-50 border-gray-100 shadow-sm'}
          `}
        >
          <Plus className="h-5 w-5" />
        </button>

        <span className="text-md font-bold text-gray-700">
          {currentQty} 
        </span>

        <button 
          onClick={onRemove} 
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border 
            ${currentQty === 0 
              ? 'bg-gray-50 text-gray-200 border-gray-100' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-100 shadow-sm'}
          `}
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}