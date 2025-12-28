/**
 * Hook para manejo de formularios
 * ================================
 * - Controla estado del formulario
 * - Permite actualizar campos fácilmente
 * - Incluye reset y setData para edición
 */

import { useState } from "react";

export default function useForm(initialValues) {
  // Estado del formulario
  const [data, setData] = useState(initialValues);

  /**
   * Actualiza un campo del formulario
   */
  const update = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Reinicia el formulario a sus valores iniciales
   */
  const reset = () => setData(initialValues);

  return { data, update, reset, setData };
}
