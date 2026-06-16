import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar el hook
import "../../assets/css/Header.css";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { X } from "lucide-react";

export default function MenuOverlay({ open, onClose }) {
  const navigate = useNavigate(); // 2. Inicializar navigate

  // Función para navegar y cerrar el menú al mismo tiempo
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`bp-menu-overlay ${open ? "open" : ""}`}>
      <div className="bp-menu-container">
        {/* Cabecera interna */}
        <div className="bp-menu-inner-header">
          <Logo className="h-7 cursor-pointer" onClick={() => handleNavigation("/")} />
          <button className="bp-menu-close" onClick={onClose}>
            <X size={30} strokeWidth={1.5} />
          </button>
        </div>

        <div className="bp-menu-body">
          <div className="bp-menu-grid">
            {/* Columna Izquierda: Links principales */}
            <div className="bp-menu-links-col">
              <ul>
                <li style={{ "--i": 1 }} onClick={() => handleNavigation("/info/preguntas-frecuentes")}>
                  Preguntas frecuentes
                </li>
                <li style={{ "--i": 2 }} onClick={() => handleNavigation("/info/politica-de-cookies")}>
                  Política de Cookies
                </li>
                <li style={{ "--i": 3 }} onClick={() => handleNavigation("/info/privacidad")}>
                  Privacidad
                </li>
                <li style={{ "--i": 4 }} onClick={() => handleNavigation("/info/terminos-y-condiciones")}>
                  Términos y condiciones
                </li>
              </ul>
            </div>

            {/* Columna Derecha: Información secundaria corregida */}
            <div className="bp-menu-info-col">
              <div className="bp-info-block" style={{ "--i": 5 }}>
                <h6>Atención al cliente</h6>
                <a href="mailto:info@bellapro.es" className="font-bold">info@bellapro.es</a>
              </div>

              <div className="bp-info-block" style={{ "--i": 6 }}>
                <h6>Síguenos en</h6>
                <ul className="bp-social-list">
                  <li><a href="https://twitter.com" target="_blank" rel="noreferrer">twitter ↗</a></li>
                  <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">linkedin ↗</a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noreferrer">instagram ↗</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}