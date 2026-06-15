import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../../../components/common/HeaderClient";
import Footer from "../../../components/common/Footer";
import { useCart } from "../../../context/CartContext";

export default function RedsysSuccessPage() {
  const navigate  = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    localStorage.removeItem("redsys_order_id");
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pink-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-5">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Pago completado!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Tu pedido ha sido confirmado. Recibirás un correo con todos los
            detalles.
          </p>

          <a
            href="/"
            className="inline-block bg-pink text-white font-medium px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition"
          >
            Volver a la tienda
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
