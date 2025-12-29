import React, { useState, useEffect } from "react";
import RadioCard from "../../common/variant/RadioCard";
import { Truck, Bolt, Gift } from "lucide-react";
import { getAll } from "../../../services/apiService";

/**
 * Mapa de iconos basado en el nombre que viene de la base de datos.
 */
const iconMap = {
  "Envío Estándar": <Truck className="w-4 h-4 text-gray-500" />,
  "Envío Express": <Bolt className="w-4 h-4 text-gray-500" />,
  "Envío Gratuito": <Gift className="w-4 h-4 text-gray-500" />
};

/**
 * @param {number} selectedShipping - ID del método seleccionado.
 * @param {function} setSelectedShipping - Función para actualizar el ID.
 * @param {function} onMethodsLoaded - NUEVA PROP: Callback para enviar los métodos al padre (CheckoutPage).
 */
const ShippingMethod = ({ selectedShipping, setSelectedShipping, onMethodsLoaded }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadShippingMethods = async () => {
      setLoading(true);
      try {
        const res = await getAll("shippingMethods");
        const methodsArray = Array.isArray(res) ? res : res.data || [];
        
        setMethods(methodsArray);

        // --- IMPORTANTE: Notificamos al padre (CheckoutPage) los métodos cargados ---
        // Esto permite que el Resumen de Orden sepa el precio de cada ID.
        if (onMethodsLoaded) {
          onMethodsLoaded(methodsArray);
        }

        // Selección por defecto: Si no hay nada seleccionado, tomamos el primero.
        if (!selectedShipping && methodsArray.length > 0) {
          setSelectedShipping(methodsArray[0].id);
        }
      } catch (error) {
        console.error("Error loading shipping methods", error);
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    loadShippingMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta al montar el componente

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Método de envío
      </h2>

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">
          Cargando métodos de envío...
        </p>
      )}

      <div className="space-y-3">
        {!loading && methods.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No hay métodos de envío disponibles en este momento.
          </p>
        )}

        {methods.map((method) => (
          <RadioCard
            key={method.id}
            title={method.name}
            subtitle={method.description}
            // Formateamos el precio para que siempre tenga 2 decimales
            price={Number(method.price) === 0 ? "Gratis" : `€${Number(method.price).toFixed(2)}`}
            icon={iconMap[method.name] || <Truck className="w-4 h-4 text-gray-500" />}
            value={method.id}
            selected={selectedShipping === method.id}
            onChange={() => setSelectedShipping(method.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ShippingMethod;