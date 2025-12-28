import React, { useState } from "react";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { QrCode, ShoppingCart, Menu } from "lucide-react";
import QRScanModal from "./QRScanModal";
import CartDrawer from "../Client/Store/CartDrawer";
import { useCart } from "../../context/CartContext"; // 👈 usamos el contexto

export default function Header() {
  const [openQR, setOpenQR] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  // CartContext
  const { cartProducts, addToCart, removeFromCart } = useCart();

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-[1150px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="h-8" />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setOpenQR(true)}
              className="flex items-center space-x-2 bg-pink-50 text-pink px-4 py-2 rounded-full hover:bg-pink-100 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-sm font-medium md:hidden">Escanear</span>
              <span className="text-sm font-medium hidden md:block">
                Escanea otra página
              </span>
            </button>

            <button onClick={() => setOpenCart(true)}>
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>

            <Menu className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </header>
      <QRScanModal open={openQR} onClose={() => setOpenQR(false)} />

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        products={cartProducts}       // carrito global
        handleAdd={addToCart}        // función global
        handleRemove={removeFromCart} // función global
      />
    </>
  );
}
