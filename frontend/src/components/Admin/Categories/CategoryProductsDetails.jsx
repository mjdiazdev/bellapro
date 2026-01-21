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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Nombre de la categoría */}
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>

      {/* Código QR de la categoría */}
      <img
        src={`http://${process.env.REACT_APP_BACKEND_URL}/storage/${category.qr_url}`}
        alt="QR"
        className="mb-6 w-40 h-40"
      />

      {/* Sección de productos */}
      <h2 className="text-xl font-semibold mb-4">Productos</h2>

      {/* Si no hay productos */}
      {products.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        // Tabla de productos
        <table className="w-full border text-left">
          {/* Cabecera de la tabla */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Referencia</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Descripción</th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.reference}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
