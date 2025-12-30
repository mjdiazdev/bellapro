import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductItem({ product, onAdd, onRemove, isMatch, id }) {
  // Verificamos que el ID exista para evitar el error 'includes' de undefined
  const safeId = id || "";

  return (
    <div 
      id={safeId} 
      className={`w-full p-4 flex items-center justify-between mb-4 transition-all duration-500 font-sans border-b py-6 rounded-xl
        ${isMatch 
          ? 'bg-pink-100 border-pink shadow-md scale-[1.02] ring-2 ring-pink/20' 
          : 'bg-transparent border-gray-200'
        }
      `}
    >
      
      {/* Sección Izquierda: Imagen + Detalles */}
      <div className="flex items-start space-x-4">
        {/* Imagen del producto */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-20 h-20 rounded-lg object-cover border transition-all ${isMatch ? 'border-pink' : 'border-gray-50'}`}
          />
          {/* Badge flotante tipo buscador */}
          {isMatch && (
            <span className="absolute -top-2 -left-2 bg-pink text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
              ¡Aquí!
            </span>
          )}
        </div>

        <div className="flex flex-col">
          {/* Nombre del producto */}
          <h3 className={`text-lg font-bold leading-tight transition-colors ${isMatch ? 'text-gray-900' : 'text-pink'}`}>
            {product.name}
          </h3>
          
          {/* Tamaño y referencia */}
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            {product.size || ''} · <span className="opacity-70">Ref:{product.reference}</span>
          </p>
          
          {/* Precio */}
          <p className="text-xl font-bold text-gray-900 mt-2">
            €{product.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sección Derecha: Controles de cantidad */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <button 
          onClick={onAdd} 
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <Plus className="h-5 w-5" />
        </button>

        <span className="text-md font-bold text-gray-700">
          {product.quantity || 0}
        </span>

        <button 
          onClick={onRemove} 
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}