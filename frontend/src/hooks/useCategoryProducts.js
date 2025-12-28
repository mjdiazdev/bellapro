import { useEffect, useState } from "react";
import { getAbsolute } from "../services/apiService";

export default function useCategoryProducts(categoryCode) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryCode) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        //  ENDPOINT REAL
        const response = await getAbsolute(`/qr/${categoryCode}`);

        //  RESPUESTA REAL
        const { category, products } = response.data;

        setCategory(category);
        setProducts(products);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryCode]);

  return { category, products, loading, error };
}
