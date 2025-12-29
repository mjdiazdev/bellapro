import React, { useState, useRef, useEffect } from "react";
import { Settings, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/apiService";

/**
 * Componente: Header
 * ------------------
 * Header principal del panel administrativo.
 *
 * Funcionalidades:
 * - Íconos de configuración y notificaciones
 * - Avatar como botón
 * - Dropdown con acciones:
 *    - Ver perfil
 *    - Cerrar sesión
 */
export default function Header() {
  // Estado para mostrar / ocultar el menú del avatar
  const [openMenu, setOpenMenu] = useState(false);

  // Referencia para detectar clicks fuera del menú
  const menuRef = useRef(null);

  const navigate = useNavigate();

  /**
   * Cerrar sesión del usuario
   */
  const handleLogout = async () => {
    try {
      await logout(); // Llamada a la API
    } catch (e) {
      // Aunque falle la API, limpiamos sesión local
      console.error("Error al cerrar sesión", e);
    } finally {
      // Limpiar datos locales
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirigir al login
      navigate("/login");
    }
  };

  /**
   * Cierra el menú si se hace click fuera
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-pink-50 py-4 px-6 border-b border-gray-100 shadow-sm flex items-center justify-between relative">
      {/* Navegación central (placeholder) */}
      <nav className="hidden md:flex items-center space-x-6" />

      {/* Acciones derecha */}
      <div className="flex items-center space-x-4 relative" ref={menuRef}>
        
        {/* Configuración */}
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <Settings className="h-5 w-5" />
        </button>

        {/* Notificaciones */}
        <button className="text-gray-500 hover:text-gray-700 transition-colors relative">
          <BellRing className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        {/* Avatar como botón */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="focus:outline-none"
        >
          <img
            className="h-9 w-9 rounded-full object-cover border-2 border-pink cursor-pointer"
            src="https://placehold.co/36x36/E83388/ffffff?text=U"
            alt="Avatar de usuario"
          />
        </button>

        {/* Dropdown del avatar */}
        {openMenu && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50">
            
            {/* Ver perfil 
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/profile"); // o placeholder
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Ver perfil
            </button>

            <hr />
            */}
            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
