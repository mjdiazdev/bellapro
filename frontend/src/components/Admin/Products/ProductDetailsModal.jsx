import { useEffect, useState } from "react";
import { getAbsolute } from "../../../services/apiService";
import { X, Package, Info, DollarSign, Euro } from "lucide-react"; 

export default function ProductDetailsModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return setLoading(false);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAbsolute(`/products/${productId}`);
        // Según tu JSON, el producto viene dentro de response.data
        setProduct(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl animate-pulse text-pink font-medium">Cargando detalles...</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-red-50 text-red-500 p-2 rounded-full transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Lado Izquierdo: Imagen */}
          <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100">
            <img 
              src={product.image_url || 'https://via.placeholder.com/300'} 
              alt={product.name} 
              className="w-full h-64 object-cover rounded-xl shadow-md border border-white"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
            />
          </div>

          {/* Lado Derecho: Detalles */}
          <div className="md:w-1/2 p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-pink uppercase tracking-widest bg-pink-50 px-2 py-1 rounded">
                {product.category?.name || 'Sin Categoría'}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">{product.name}</h1>
              <p className="text-sm text-gray-400">Ref: {product.reference}</p>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-gray-50">
              <div className="flex-1">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                   Precio  €
                </p>
                <p className="text-xl font-bold text-gray-900">{Number(product.price).toFixed(2)}€</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Package size={12} /> Stock Disponible
                </p>
                <p className={`text-xl font-bold ${product.stock?.stock > 0 ? 'text-pink-600' : 'text-red-500'}`}>
                  {product.stock?.stock ?? 0} unidades
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                <Info size={12} /> Descripción
              </p>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {product.description || "Este producto no tiene una descripción detallada todavía."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}