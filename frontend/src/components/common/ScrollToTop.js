import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sube el scroll al top en cada cambio de ruta.
 * Evita que al navegar a /checkout la página aparezca
 * desplazada al punto donde el usuario estaba en la página anterior.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
