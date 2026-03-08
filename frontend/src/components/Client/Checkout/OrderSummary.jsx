import React from "react";
import { useCart } from "../../../context/CartContext";

export default function OrderSummary({ selectedShippingMethod }) {
  const { cartProducts } = useCart();

  const productsInCart = cartProducts.filter(p => p.quantity > 0);
  const subtotalProducts = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  
  // Obtenemos el precio del envío
  const shippingPrice = selectedShippingMethod ? Number(selectedShippingMethod.price) : 0;
  
  // Lógica de cálculos
  const baseImponible = subtotalProducts + shippingPrice;
  const IVA_RATE = 0.21;
  const iva = baseImponible * IVA_RATE;
  const total = baseImponible + iva;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumen de tu pedido</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-3 text-sm">
          
          {/* Lista de productos */}
          <div className="max-h-40 overflow-y-auto mb-4 space-y-2 pr-2">
            {productsInCart.map(product => (
              <div key={product.id} className="flex justify-between text-gray-600">
                <span>{product.quantity}x {product.name}</span>
                <span className="font-medium">€{(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-100" />

          {/* Desglose de costos */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal productos</span>
              <span>€{subtotalProducts.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span className="flex flex-col">
                <span>Gastos de envío</span>
                <span className="text-[10px] text-pink italic">
                  {selectedShippingMethod?.name || "Pendiente de selección"}
                </span>
              </span>
              <span>{shippingPrice > 0 ? `${shippingPrice.toFixed(2)}€` : '0.00€'}</span>
            </div>

            {/* BASE IMPONIBLE: Suma de productos + envío */}
            <div className="flex justify-between font-semibold text-gray-700 pt-2 border-t border-dashed border-gray-200">
              <span>Base Imponible</span>
              <span>{baseImponible.toFixed(2)}€</span>
            </div>

            <div className="flex justify-between">
              <span>IVA (21%)</span>
              <span>{iva.toFixed(2)}€</span>
            </div>
          </div>

          <hr className="border-gray-800 my-4" />

          {/* TOTAL FINAL */}
          <div className="flex justify-between items-end font-bold  text-gray-900">
            <span className="text-base mb-1">Total</span>
            <div className="flex flex-col items-end">
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          <p className="text-[10px] text-right text-gray-400 mt-4 leading-tight">
            Los precios incluyen impuestos y tasas aplicables según la normativa vigente.
          </p>
        </div>
      </div>
    </section>
  );
}