/**
 * Hook genérico para manejar CRUD de cualquier recurso
 * =====================================================
 * Este hook abstrae:
 * - Carga de datos (GET ALL)
 * - Obtener un registro por ID (GET)
 * - Crear (POST)
 * - Actualizar (PUT/PATCH)
 * - Eliminar (DELETE)
 *
 * Permite reutilizar la lógica en todas las páginas de listados
 * simplemente pasando el "resource" (ej: "categories", "products", etc.)
 */

import { useState, useEffect, useCallback } from "react"; // <-- Importamos useCallback
import {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem
} from "../services/apiService";

export default function useCrud(resource) {
  // Estado donde se almacenan los registros del recurso
  const [items, setItems] = useState([]);

  /**
   * Obtiene todos los registros del recurso
   * Usamos useCallback para estabilizar la función y usarla como dependencia.
   */
  const loadData = useCallback(async () => {
    try {
      const data = await getAll(resource);
      setItems(data);
    } catch (error) {
      console.error(`Error loading data for resource ${resource}:`, error);
      // Opcional: manejar el estado de error aquí
    }
  }, [resource]); // <-- resource es la única dependencia externa que podría cambiar

  /**
   * Carga inicial de datos
   * Se ejecuta al montar el componente.
   */
  useEffect(() => {
    loadData();
  }, [loadData]); // <-- CORRECCIÓN: Agregamos loadData como dependencia para evitar el warning

  /**
   * Métodos CRUD expuestos
   */
  // Opcional: Podrías envolver estos también en useCallback si fueran a usarse como dependencias de otros hooks.
  const getItem = (id) => getById(resource, id);
  const create = (data) => createItem(resource, data);
  const update = (id, data) => updateItem(resource, id, data);
  const remove = (id) => deleteItem(resource, id);


  // Retornamos todo lo necesario para interactuar con el recurso
  return {
    items,
    loadData,
    getItem,
    create,
    update,
    remove
  };
}
