import React from "react";
import { X } from "lucide-react";
import ProductItem from "./ProductItem";
import { useCart } from "../../../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cartProducts, addToCart, removeFromCart } = useCart();

  // Solo productos con quantity > 0
  const productsInCart = cartProducts.filter(p => p.quantity > 0);

  // Totales
  const items = productsInCart.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = productsInCart.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Carrito</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
        {productsInCart.length ? (
          productsInCart.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              onAdd={() => addToCart(product)}
              onRemove={() => removeFromCart(product.id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay productos en el carrito
          </p>
        )}
      </div>

      {/* Totales */}
      <div className="p-4 border-t">
        <div className="flex justify-between text-sm">
          <span>Items</span>
          <span>{items}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
