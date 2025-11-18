import React from "react";
import "../assets/header.css";

export default function MenuOverlay({ open, onClose }) {
  return (
    <div className={`bp-menu-overlay ${open ? "open" : ""}`}>
      <button className="bp-menu-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="bp-menu-content container">
        <div className="row">
          <div className="col-md-6">
            <ul className="bp-menu-links">
              <li>Preguntas frecuentes</li>
              <li>Política de Cookies</li>
              <li>Privacidad</li>
              <li>Términos y condiciones</li>
              <li>Condiciones de envío</li>
            </ul>
          </div>

          <div className="col-md-6 bp-menu-right">
            <div className="mb-4">
              <h6>Atención al cliente</h6>
              <strong>info@bellapro.com</strong>
            </div>

            <div>
              <h6>Síguenos en</h6>
              <ul className="bp-social-links">
                <li>twitter ↗</li>
                <li>linkedin ↗</li>
                <li>instagram ↗</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
