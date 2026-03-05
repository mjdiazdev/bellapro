import React, { useEffect, useState } from "react";
import Input from "../../common/variant/Input";
import { getAbsolute } from "../../../services/apiService";

const BillingForm = ({
  billingForm,
  setBillingForm,
  shippingDifferent,
  setShippingDifferent
}) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCP, setIsLoadingCP] = useState(false);

  // Cargar provincias al inicio
  useEffect(() => {
    getAbsolute("/provinces").then(res => {
      setProvinces(res.data || []);
    });
  }, []);

  // Sincronización de ciudades (para cuando ya existe una provincia seleccionada)
  useEffect(() => {
    if (billingForm.province_id) {
      getAbsolute(`/cities/province/${billingForm.province_id}`).then(res => {
        setCities(res.data || []);
      });
    }
  }, [billingForm.province_id]);

  const handleChange = (field) => (e) => {
    setBillingForm({
      ...billingForm,
      [field]: e.target.value
    });
  };

  /**
   * Nueva lógica de Autocompletado Integrada
   */
  const handlePostalCodeChange = async (e) => {
    const cpValue = e.target.value;
    
    setBillingForm(prev => ({ ...prev, postal_code: cpValue }));

    // Disparamos la búsqueda al completar los 5 dígitos
    if (cpValue.length === 5) {
      setIsLoadingCP(true);
      try {
        // Llamada al nuevo endpoint que estás creando
        const res = await getAbsolute(`/postal-codes/search/${cpValue}`);
        const data = res.data; 

        if (data && data.city) {
          const provinceId = data.city.province?.id || data.city.province_id;
          const cityId = data.city.id;

          // 1. Cargamos las ciudades de esa provincia inmediatamente
          // Esto asegura que el select de Ciudad tenga el nombre listo para mostrar
          const citiesRes = await getAbsolute(`/cities/province/${provinceId}`);
          setCities(citiesRes.data || []);

          // 2. Actualizamos el estado completo del formulario
          setBillingForm(prev => ({
            ...prev,
            postal_code_id: data.id,
            province_id: provinceId,
            city_id: cityId
          }));
        }
      } catch (error) {
        console.error("Código postal no encontrado en la base de datos.");
      } finally {
        setIsLoadingCP(false);
      }
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Datos de facturación
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="CIF / NIF"
            value={billingForm.nif || ""}
            onChange={handleChange("nif")}
          />
          <Input
            placeholder="Nombre / Razón social"
            value={billingForm.name || ""}
            onChange={handleChange("name")}
          />
        </div>

        <Input
          placeholder="Dirección"
          value={billingForm.address || ""}
          onChange={handleChange("address")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Casa, apartamento (opcional)"
            value={billingForm.address_extra || ""}
            onChange={handleChange("address_extra")}
          />
          <Input
            placeholder="Teléfono"
            value={billingForm.phone || ""}
            onChange={handleChange("phone")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Campo de Código Postal disparador */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Código Postal</label>
            <Input
              placeholder="Ej: 08001"
              value={billingForm.postal_code || ""}
              onChange={handlePostalCodeChange}
              className={isLoadingCP ? "animate-pulse border-pink-300" : ""}
            />
          </div>

          {/* Provincia (Auto-rellenada) */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Provincia</label>
            <select
              value={billingForm.province_id || ""}
              disabled
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed h-[50px] appearance-none"
            >
              <option value="">Provincia</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Ciudad (Auto-rellenada) */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Ciudad</label>
            <select
              value={billingForm.city_id || ""}
              disabled
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed h-[50px] appearance-none"
            >
              <option value="">Ciudad</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center space-x-2 mt-4 cursor-pointer group">
          <div
            onClick={() => setShippingDifferent(!shippingDifferent)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              shippingDifferent ? "bg-pink-500 border-pink-500" : "border-gray-300 group-hover:border-pink-400"
            }`}
          >
            {shippingDifferent && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-gray-600">
            Utilizar una dirección de envío diferente
          </span>
        </label>
      </div>
    </section>
  );
};

export default BillingForm;