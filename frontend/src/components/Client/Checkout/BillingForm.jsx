import React, { useEffect, useState } from "react";
import Input from "../../common/variant/Input";
import { getAbsolute } from "../../../services/apiService";

/**
 * BillingForm
 * ------------------
 * Formulario de facturación.
 * NO maneja estado propio del formulario.
 * Todo el estado vive en CheckoutPage (billingForm).
 */
const BillingForm = ({
  billingForm,
  setBillingForm,
  shippingDifferent,
  setShippingDifferent
}) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);

  // Cargar provincias
  useEffect(() => {
    getAbsolute("/provinces").then(res => {
      setProvinces(res.data || []);
    });
  }, []);

  const handleChange = (field) => (e) => {
    setBillingForm({
      ...billingForm,
      [field]: e.target.value
    });
  };

  const handleProvinceChange = async (e) => {
    const provinceId = Number(e.target.value);

    setBillingForm({
      ...billingForm,
      province_id: provinceId,
      city_id: "",
      postal_code_id: ""
    });

    setCities([]);
    setPostalCodes([]);

    if (provinceId) {
      const res = await getAbsolute(`/cities/province/${provinceId}`);
      setCities(res.data || []);
    }
  };

  const handleCityChange = async (e) => {
    const cityId = Number(e.target.value);

    setBillingForm({
      ...billingForm,
      city_id: cityId,
      postal_code_id: ""
    });

    setPostalCodes([]);

    if (cityId) {
      const res = await getAbsolute(`/postal-codes/city/${cityId}`);
      setPostalCodes(res.data || []);
    }
  };

  const handlePostalChange = (e) => {
    const postalCodeId = Number(e.target.value);
    const postal = postalCodes.find(pc => pc.id === postalCodeId);

    setBillingForm({
      ...billingForm,
      postal_code_id: postalCodeId,
      postal_code: postal?.code || ""
    });
  };

    // Precargar ciudades si hay provincia
  useEffect(() => {
    if (!billingForm.province_id) return;

    getAbsolute(`/cities/province/${billingForm.province_id}`)
      .then(res => setCities(res.data || []));
  }, [billingForm.province_id]);

  // Precargar códigos postales si hay ciudad
  useEffect(() => {
    if (!billingForm.city_id) return;

    getAbsolute(`/postal-codes/city/${billingForm.city_id}`)
      .then(res => setPostalCodes(res.data || []));
  }, [billingForm.city_id]);


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

        <div className="grid grid-cols-3 gap-3">
          <select
            value={billingForm.province_id || ""}
            onChange={handleProvinceChange}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Seleccione una provincia</option>
            {provinces.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={billingForm.city_id || ""}
            onChange={handleCityChange}
            disabled={!billingForm.province_id}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Seleccione una ciudad</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={billingForm.postal_code_id || ""}
            onChange={handlePostalChange}
            disabled={!billingForm.city_id}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Seleccione un código postal</option>
            {postalCodes.map(pc => (
              <option key={pc.id} value={pc.id}>{pc.code}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center space-x-2 mt-2 cursor-pointer">
          <div
            onClick={() => setShippingDifferent(!shippingDifferent)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              shippingDifferent ? "bg-pink-500 border-pink-500" : "border-gray-300"
            }`}
          >
            {shippingDifferent && (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
          <span className="text-sm text-gray-700">
            Dirección de envío diferente
          </span>
        </label>
      </div>
    </section>
  );
};

export default BillingForm;
