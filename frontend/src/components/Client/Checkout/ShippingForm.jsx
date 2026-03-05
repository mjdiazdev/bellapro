import React, { useEffect, useState } from "react";
import Input from "../../common/variant/Input";
import { getAbsolute } from "../../../services/apiService";

const ShippingForm = ({ shippingForm, setShippingForm }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCP, setIsLoadingCP] = useState(false);

  // 1. Cargar todas las provincias al montar
  useEffect(() => {
    getAbsolute("/provinces").then(res => {
      setProvinces(res.data || []);
    });
  }, []);

  // 2. Efecto para mantener las ciudades sincronizadas si cambia la provincia_id
  useEffect(() => {
    if (shippingForm.province_id) {
      getAbsolute(`/cities/province/${shippingForm.province_id}`).then(res => {
        setCities(res.data || []);
      });
    }
  }, [shippingForm.province_id]);

  const handleChange = (field) => (e) => {
    setShippingForm({
      ...shippingForm,
      [field]: e.target.value
    });
  };

  /**
   * Lógica de Autocompletado por CP para Envío
   */
  const handlePostalCodeChange = async (e) => {
    const cpValue = e.target.value;
    
    // Actualizamos el valor mientras el usuario escribe
    setShippingForm(prev => ({ ...prev, postal_code: cpValue }));

    // Buscamos cuando el código tenga 5 dígitos
    if (cpValue.length === 5) {
      setIsLoadingCP(true);
      try {
        const res = await getAbsolute(`/postal-codes/search/${cpValue}`);
        const data = res.data; 

        if (data && data.city) {
          const provinceId = data.city.province?.id || data.city.province_id;
          const cityId = data.city.id;

          // Cargamos las ciudades de esa provincia para que el select tenga el nombre listo
          const citiesRes = await getAbsolute(`/cities/province/${provinceId}`);
          setCities(citiesRes.data || []);

          // Actualizamos el estado de envío
          setShippingForm(prev => ({
            ...prev,
            postal_code_id: data.id,
            province_id: provinceId,
            city_id: cityId
          }));
        }
      } catch (error) {
        console.error("Código postal no válido para la zona de entrega.");
      } finally {
        setIsLoadingCP(false);
      }
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Dirección de envío
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="CIF / NIF" 
            value={shippingForm.nif || ""} 
            onChange={handleChange("nif")} 
          />
          <Input 
            placeholder="Nombre / Razón social" 
            value={shippingForm.name || ""} 
            onChange={handleChange("name")} 
          />
        </div>

        <Input 
          placeholder="Dirección de entrega" 
          value={shippingForm.address || ""} 
          onChange={handleChange("address")} 
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="Casa, apartamento (opcional)" 
            value={shippingForm.address_extra || ""} 
            onChange={handleChange("address_extra")} 
          />
          <Input 
            placeholder="Teléfono de contacto" 
            value={shippingForm.phone || ""} 
            onChange={handleChange("phone")} 
          />
        </div>

        {/* Localización Geográfica Autocompletable */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          
          {/* Input CP - El disparador */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Código Postal</label>
            <Input
              placeholder="Ej: 28001"
              value={shippingForm.postal_code || ""}
              onChange={handlePostalCodeChange}
              className={isLoadingCP ? "animate-pulse border-pink-300" : ""}
            />
          </div>

          {/* Select Provincia - Solo lectura */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Provincia</label>
            <select
              value={shippingForm.province_id || ""}
              disabled
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed h-[50px] appearance-none"
            >
              <option value="">Provincia</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Select Ciudad - Solo lectura */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Ciudad</label>
            <select
              value={shippingForm.city_id || ""}
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
      </div>
    </section>
  );
};

export default ShippingForm;