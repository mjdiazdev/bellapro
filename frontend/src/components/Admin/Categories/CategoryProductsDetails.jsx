import { useEffect, useState } from "react";
import { getAbsolute } from "../../../services/apiService";

/**
 * Componente: CategoryProductsDetails
 * -----------------------------------
 * Muestra los detalles de una categoría específica junto con sus productos.
 * 
 * Props:
 * - categoryCode: Código único de la categoría (string)
 * 
 * Lógica:
 * - Consulta la API para obtener la categoría y productos asociados
 * - Maneja estado de carga, errores y datos
 */
export default function CategoryProductsDetails({ categoryCode }) {
  // Estado para almacenar la información de la categoría
  const [category, setCategory] = useState(null);

  // Estado para almacenar los productos de la categoría
  const [products, setProducts] = useState([]);

  // Estado de carga mientras se obtiene la información desde la API
  const [loading, setLoading] = useState(true);

  /**
   * useEffect para obtener datos cuando cambia la categoría seleccionada
   */
  useEffect(() => {

    // Si no hay código de categoría, no se hace la consulta
    if (!categoryCode) {
      setLoading(false); // Desactivar indicador de carga
      return;
    }

    /**
     * Función asíncrona para obtener datos de la API
     */
    const fetchData = async () => {
      try {
        setLoading(true); // Activar indicador de carga

        // Llamada a la API usando la función getAbsolute
        const response = await getAbsolute(`/qr/${categoryCode}`);

        // Extraemos category y products de la respuesta
        const { category, products } = response.data;

        // Guardamos los datos en el estado
        setCategory(category);
        setProducts(products);

      } catch (error) {
        // Log de errores para depuración
        console.error(
          error.response?.data || error.message
        );
      } finally {
        // Siempre desactivar indicador de carga al finalizar
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryCode]); // Dependencia: se ejecuta al cambiar categoryCode

  // Render de estado de carga
  if (loading) return <div className="p-6">Cargando...</div>;

  // Render si la categoría no fue encontrada
  if (!category) return <div className="p-6">Categoría no encontrada</div>;

  // Render principal con información de categoría y productos
  return (
    /* Añadimos max-h para que el modal no crezca infinitamente 
       y flex-col para organizar el contenido.
    */
    <div className="flex flex-col max-h-[80vh] w-full">
      
      {/* Cabecera fija del modal (Nombre y QR) */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
            <p className="text-sm text-gray-500 italic">Código de categoría: {categoryCode}</p>
          </div>
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/storage/${category.qr_url}`}
            alt="QR"
            className="w-24 h-24 border rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Cuerpo del modal con SCROLL 
          overflow-y-auto permite deslizar solo esta sección
      */}
      <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Productos Vinculados</h2>

        {products.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="w-full text-left bg-white border-collapse">
              {/* thead con sticky para que no se pierda al bajar */}
              <thead className="bg-pink text-white sticky top-0">
                <tr>
                  <th className="p-3 text-sm font-semibold">Nombre</th>
                  <th className="p-3 text-sm font-semibold">Referencia</th>
                  <th className="p-3 text-sm font-semibold text-right">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-pink-50 transition-colors">
                    <td className="p-3 text-sm font-medium text-gray-800">{p.name}</td>
                    <td className="p-3 text-sm text-gray-600 font-mono">{p.reference}</td>
                    <td className="p-3 text-sm text-gray-800 text-right font-bold">
                      €{Number(p.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}