import { useEffect, useState } from "react";
import { getAbsolute } from "../../../services/apiService";

export default function ProductDetailsModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return setLoading(false);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAbsolute(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!product) return <div className="p-6">Producto no encontrado</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 font-semibold">✕</button>

        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <img src={product.photo_url} alt={product.name} className="mb-6 w-40 h-40 object-cover" />
        <p><strong>Referencia:</strong> {product.reference}</p>
        <p><strong>Precio:</strong> {product.price}</p>
        <p><strong>Descripción:</strong> {product.description}</p>
        <p><strong>Categoría ID:</strong> {product.category_id}</p>
      </div>
    </div>
  );
}
