import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import Header from "../../../components/common/HeaderClient";
import Footer from "../../../components/common/Footer";

export default function RedsysErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pink-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-5">
            <XCircle className="w-16 h-16 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pago no completado
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            La operación fue denegada o cancelada. No se ha realizado ningún
            cargo. Puedes intentarlo de nuevo o elegir otro método de pago.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/checkout")}
              className="bg-pink text-white font-medium px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition"
            >
              Volver al pago
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-200 text-gray-600 font-medium px-6 py-2.5 rounded-full text-sm hover:bg-gray-50 transition"
            >
              Ir a la tienda
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
