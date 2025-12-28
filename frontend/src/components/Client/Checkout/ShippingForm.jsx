import React, { useEffect, useState } from "react";
import Input from "../../common/variant/Input";
import { getAbsolute } from "../../../services/apiService";

const ShippingForm = ({ shippingForm, setShippingForm }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);

  // Provincias
  useEffect(() => {
    getAbsolute("/provinces").then(res => {
      setProvinces(res.data || []);
    });
  }, []);

  // Precargar ciudades
  useEffect(() => {
    if (!shippingForm.province_id) return;

    getAbsolute(`/cities/province/${shippingForm.province_id}`)
      .then(res => setCities(res.data || []));
  }, [shippingForm.province_id]);

  // Precargar códigos postales
  useEffect(() => {
    if (!shippingForm.city_id) return;

    getAbsolute(`/postal-codes/city/${shippingForm.city_id}`)
      .then(res => setPostalCodes(res.data || []));
  }, [shippingForm.city_id]);

  const handleChange = (field) => (e) => {
    setShippingForm({
      ...shippingForm,
      [field]: e.target.value
    });
  };

  const handleProvinceChange = async (e) => {
    const provinceId = Number(e.target.value);

    setShippingForm({
      ...shippingForm,
      province_id: provinceId,
      city_id: "",
      postal_code_id: "",
      postal_code: ""
    });

    setCities([]);
    setPostalCodes([]);
  };

  const handleCityChange = async (e) => {
    const cityId = Number(e.target.value);

    setShippingForm({
      ...shippingForm,
      city_id: cityId,
      postal_code_id: "",
      postal_code: ""
    });

    setPostalCodes([]);
  };

  const handlePostalChange = (e) => {
    const postalCodeId = Number(e.target.value);
    const postal = postalCodes.find(pc => pc.id === postalCodeId);

    setShippingForm({
      ...shippingForm,
      postal_code_id: postalCodeId,
      postal_code: postal?.code || ""
    });
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Dirección de envío
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

        <Input placeholder="CIF / NIF" value={shippingForm.nif || ""} onChange={handleChange("nif")} />
        <Input placeholder="Nombre / Razón social" value={shippingForm.name || ""} onChange={handleChange("name")} />
        <Input placeholder="Dirección" value={shippingForm.address || ""} onChange={handleChange("address")} />
        <Input placeholder="Casa, apartamento (opcional)" value={shippingForm.address_extra || ""} onChange={handleChange("address_extra")} />
        <Input placeholder="Teléfono" value={shippingForm.phone || ""} onChange={handleChange("phone")} />

        <div className="grid grid-cols-3 gap-3">
          <select
            value={shippingForm.province_id || ""}
            onChange={handleProvinceChange}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Provincia</option>
            {provinces.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={shippingForm.city_id || ""}
            onChange={handleCityChange}
            disabled={!shippingForm.province_id}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Ciudad</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={shippingForm.postal_code_id || ""}
            onChange={handlePostalChange}
            disabled={!shippingForm.city_id}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option value="">Código postal</option>
            {postalCodes.map(pc => (
              <option key={pc.id} value={pc.id}>{pc.code}</option>
            ))}
          </select>
        </div>

      </div>
    </section>
  );
};

export default ShippingForm;
