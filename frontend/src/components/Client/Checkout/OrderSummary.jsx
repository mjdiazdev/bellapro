import React from "react";
import { useCart } from "../../../context/CartContext";

export default function OrderSummary() {
  const { cartProducts } = useCart();

  // Solo productos con cantidad > 0
  const productsInCart = cartProducts.filter(p => p.quantity > 0);

  // Totales
  const subtotal = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const IVA_RATE = 0.21;
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumen</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-3 text-sm">

          {/* Lista de productos */}
          {productsInCart.map(product => (
            <div key={product.id} className="flex justify-between">
              <span>
                {product.quantity}x {product.name}
              </span>
              <span>€{(product.price * product.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>IVA 21%</span>
            <span>€{iva.toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <p className="text-xs text-right text-gray-500">
            *Precio sin IVA
          </p>
        </div>
      </div>
    </section>
  );
}
