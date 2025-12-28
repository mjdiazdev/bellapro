/**
 * Hook para controlar modales
 * ============================
 * - Permite abrir/cerrar sin necesidad de usar múltiples estados.
 * - Reutilizable en confirm, alert, form modal, etc.
 */

import { useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);

  // Muestra el modal
  const show = () => setOpen(true);

  // Oculta el modal
  const hide = () => setOpen(false);

  return { open, show, hide };
}
