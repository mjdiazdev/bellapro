import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { QrCode, ShoppingCart, Menu as MenuIcon } from "lucide-react"; // Renombrado para evitar conflicto
import QRScanModal from "./QRScanModal";
import CartDrawer from "../Client/Store/CartDrawer";
import MenuOverlay from "./MenuOverlay"; // Importamos el nuevo componente
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [openQR, setOpenQR] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // Estado para el menú

  const { cartProducts, addToCart, removeFromCart } = useCart();
  const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <>
      <header className="w-full bg-pink-50 fixed top-0 left-0 z-50">
        <div className="max-w-[1150px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Logo className="h-8" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setOpenQR(true)}
              className="flex items-center border border-pink space-x-2 bg-pink-50 text-pink px-4 py-2 rounded-full hover:bg-pink-100 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-sm font-medium hidden md:block">
                Escanea otra página
              </span>
            </button>

            <button 
              onClick={() => setOpenCart(true)} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-pink text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* BOTÓN MENÚ ACTUALIZADO */}
            <MenuIcon 
              className="h-6 w-6 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" 
              onClick={() => setOpenMenu(true)}
            />
          </div>
        </div>
      </header>
      
      <QRScanModal open={openQR} onClose={() => setOpenQR(false)} />

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        products={cartProducts}
        handleAdd={addToCart}
        handleRemove={removeFromCart}
      />

      {/* COMPONENTE MENU OVERLAY */}
      <MenuOverlay open={openMenu} onClose={() => setOpenMenu(false)} />
    </>
  );
}