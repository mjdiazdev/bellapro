import React, { useState, useEffect } from "react";
import RadioCard from "../../common/variant/RadioCard";
import { Truck, Bolt, Gift } from "lucide-react";
import { getAll } from "../../../services/apiService";

// Mapa de iconos
const iconMap = {
  "Envío Estándar": <Truck className="w-4 h-4 text-gray-500" />,
  "Envío Express": <Bolt className="w-4 h-4 text-gray-500" />,
  "Envío Gratuito": <Gift className="w-4 h-4 text-gray-500" />
};

const ShippingMethod = ({ selectedShipping, setSelectedShipping }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadShippingMethods = async () => {
    setLoading(true);
    try {
      const res = await getAll("shippingMethods");
      const methodsArray = Array.isArray(res) ? res : res.data || [];
      setMethods(methodsArray);

      if (!selectedShipping && methodsArray.length > 0) {
        setSelectedShipping(methodsArray[0].id);
      }
    } catch (error) {
      console.error("Error loading shipping methods", error);
      setMethods([]); // fallback seguro
    } finally {
      setLoading(false);
    }
  };


    loadShippingMethods();
  }, []);

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Método de envío
      </h2>

      {loading && <p className="text-sm text-gray-500">Cargando métodos de envío...</p>}

      <div className="space-y-3">
        {methods.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No hay métodos de envío disponibles</p>
        )}

        {methods.map(method => (
          <RadioCard
            key={method.id}
            title={method.name}
            subtitle={method.description}
            price={`€${Number(method.price).toFixed(2)}`}
            icon={iconMap[method.name] || null}
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
