import React from "react";
import "../assets/header.css";

export default function TopActions({ showSearch = true }) {
  return (
    <div className="bp-top-actions px-3 d-flex justify-content-between align-items-center">
      {/* Buscador */}
      {showSearch && (
        <div className="bp-search-container flex-grow-1 me-3">
          <i className="fas fa-search bp-search-icon"></i>
          <input
            type="text"
            className="bp-search-input"
            placeholder="Buscar producto"
          />
        </div>
      )}

      {/* Botón carrito */}
      <button className="bp-cart-btn">
        <i className="fas fa-shopping-cart"></i>
      </button>
    </div>
  );
}
