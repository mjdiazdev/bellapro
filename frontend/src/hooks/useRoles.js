import { useEffect, useState } from "react";
import { getAll } from "../api/crud"; // Ajusta ruta si fuera necesario

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getAll("roles");
        setRoles(data);
      } catch (error) {
        console.error("Error cargando roles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  return { roles, loading };
};
