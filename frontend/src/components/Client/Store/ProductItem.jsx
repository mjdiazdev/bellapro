import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductItem({ product, onAdd, onRemove }) {
  return (
    <div className="w-full p-4 flex items-center justify-between mb-4 transition-shadow font-sans border-b border-gray-200 py-6">
      
      {/* Sección Izquierda: Imagen + Detalles */}
      <div className="flex items-start space-x-4">
        {/* Imagen del producto */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover border border-gray-50"
          />
        </div>

        <div className="flex flex-col">
          {/* Nombre del producto */}
          <h3 className="text-lg font-bold text-pink leading-tight">
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
        {/* Botón + */}
        <button 
          onClick={onAdd} 
          className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Cantidad actual */}
        <span className="text-md font-bold text-gray-700">
          {product.quantity || 0}
        </span>

        {/* Botón - */}
        <button 
          onClick={onRemove} 
          className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
