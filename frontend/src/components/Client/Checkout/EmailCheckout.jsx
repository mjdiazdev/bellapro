import React, { useState } from "react";
import Input from "../../common/variant/Input";
import { getAbsolute } from "../../../services/apiService";

/**
 * Componente: EmailCheckout
 * =========================
 * Maneja el email del checkout.
 *
 * Flujo:
 * - Si el cliente existe → carga datos desde API
 * - Si NO existe → inicializa un cliente nuevo con email
 * - Nunca devuelve `null`
 */
const EmailCheckout = ({ onCustomerLoaded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  /**
   * Maneja el cambio del input con debounce
   */
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Cancelar timeout anterior
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Esperar 500ms antes de consultar
    const timeout = setTimeout(() => {
      fetchCustomer(value);
    }, 500);

    setTypingTimeout(timeout);
  };

  /**
   * Busca el cliente por email
   */
  const fetchCustomer = async (email) => {
    if (!email) return;

    try {
      setLoading(true);

      const res = await getAbsolute(`/customers/email/${email}`);
      const customer = res.data?.data || res.data || res;

      // ✅ Cliente existente
      onCustomerLoaded(customer);

    } catch (error) {
      /**
       * ✅ Cliente NO existe
       * Inicializamos un cliente base con email
       * Esto permite que BillingForm complete el resto
       */
      onCustomerLoaded({
        email,
        nif: "",
        name: "",
        address: "",
        address_extra: "",
        phone: "",
        postal_code: null
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Contacto
      </h2>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange}
      />

      {loading && (
        <p className="text-sm text-gray-400 mt-2">
          Buscando cliente…
        </p>
      )}
    </section>
  );
};

export default EmailCheckout;
