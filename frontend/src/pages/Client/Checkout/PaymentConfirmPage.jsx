import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { capturePaypalPayment } from "../../../services/apiService";
import { useCart } from "../../../context/CartContext";
import CheckoutHeader from "../../../components/common/HeaderClient";

export default function PaymentConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Estado para controlar la UI: processing (cargando), success (éxito), error (fallo)
  const [status, setStatus] = useState("processing"); 

  /**
   * IMPORTANTE:
   * 'hasCalled' evita que el efecto se ejecute dos veces. 
   * En desarrollo, React monta los componentes dos veces (Strict Mode), lo que causaba
   * que enviáramos dos peticiones de captura a PayPal. La segunda fallaba con 
   * el error "ORDER_ALREADY_CAPTURED".
   */
  const hasCalled = useRef(false);

  useEffect(() => {
    // Si ya iniciamos una llamada, salimos de la función para no duplicar
    if (hasCalled.current) return;

    const confirmPayment = async () => {
      /**
       * 1. Recuperamos los IDs necesarios:
       * - paypalOrderId: Es el 'token' que devuelve PayPal en la URL tras el pago.
       * - localOrderId: Es el ID de la base de datos que guardamos en CheckoutPage.
       */
      const paypalOrderId = searchParams.get("token");
      const localOrderId = localStorage.getItem("pending_order_id");

      // Validación de seguridad inicial
      if (!paypalOrderId || !localOrderId) {
        console.error("Faltan parámetros de orden para procesar la captura.");
        setStatus("error");
        return;
      }

      try {
        // Marcamos que ya se inició el proceso de captura
        hasCalled.current = true;

        /**
         * 2. Llamada al Backend:
         * Enviamos ambos IDs a Laravel. El backend hará:
         * - Obtener Access Token de PayPal.
         * - Llamar a la API de PayPal para capturar el dinero (POST con {} en el body).
         * - Actualizar la orden a 'paid' y el pago a 'completed'.
         */
        await capturePaypalPayment(localOrderId, paypalOrderId);
        
        // 3. Limpieza post-pago exitoso
        clearCart();
        localStorage.removeItem("pending_order_id");
        setStatus("success");
        
        // Redirigir a la página de agradecimiento tras una breve pausa visual
        setTimeout(() => navigate("/thanks"), 3000);

      } catch (error) {
        /**
         * Manejo de errores:
         * Si el error es 'ORDER_ALREADY_CAPTURED', es probable que la primera llamada
         * sí haya funcionado pero React haya reintentado. Si el backend confirma éxito,
         * redirigimos normalmente.
         */
        const serverMessage = error.response?.data?.message || "";
        
        if (serverMessage.includes("ORDER_ALREADY_CAPTURED")) {
          console.warn("La orden ya estaba capturada, redirigiendo por éxito previo.");
          setStatus("success");
          setTimeout(() => navigate("/thanks"), 2000);
          return;
        }

        console.error("Error capturando pago:", error);
        alert("Error del servidor: " + (serverMessage || error.message)); 
        setStatus("error");
      }
    };

    confirmPayment();
  }, [searchParams, navigate, clearCart]); // Dependencias necesarias para el useEffect

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
      <CheckoutHeader />
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        {/* VISTA: PROCESANDO */}
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <h2 className="text-xl font-bold mt-4">Confirmando tu pago...</h2>
            <p className="text-gray-500">Por favor, no cierres esta ventana.</p>
          </>
        )}

        {/* VISTA: ÉXITO */}
        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold">¡Pago Confirmado!</h2>
            <p>Estamos preparando tu pedido. Redirigiendo...</p>
          </>
        )}

        {/* VISTA: ERROR */}
        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-bold">Algo salió mal</h2>
            <p>No pudimos verificar el pago. Contacta con soporte.</p>
            <button 
              onClick={() => navigate("/checkout")}
              className="mt-4 text-pink-500 underline font-medium"
            >
              Volver al checkout e intentar de nuevo
            </button>
          </>
        )}
      </div>
    </div>
  );
}