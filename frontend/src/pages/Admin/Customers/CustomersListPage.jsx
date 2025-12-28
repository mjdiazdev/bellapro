/**
 * Página: CustomersListPage
 * ========================
 * Página de administración de Clientes.
 * Utiliza hooks reutilizables:
 * - useCrud → CRUD para Clientes
 * - useModal → control de modales
 * - useForm → formulario controlado
 *
 * Componentes principales:
 * - Header / Sidebar / Footer → Layout
 * - CustomersList → Tabla de Clientes
 * - Modal / ConfirmModal / AlertModal → Modales
 */

import { useState } from "react";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";

import CustomersList from "../../../components/Admin/Customers/CustomersList";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";

import Button from "../../../components/common/variant/Button";

import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import { getAbsolute } from "../../../services/apiService";


export default function CustomersListPage() {
  // Endpoint del recurso
  const RESOURCE = "customers";

  // Hook CRUD
  const { items: customers, loadData, getItem, create, update, remove } = useCrud(RESOURCE);

  // Hook CRUD para categorías (para el select)
  const { items: postal } = useCrud("postalCodes");
  const postalOptions = Array.isArray(postal?.data) ? postal.data : [];

  // Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Formulario controlado
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } =
    useForm({
      nif: "",
      email: "",
      name: "",
      phone: "",
      address: "",
      address_extra: "",
      province_id: "",
      city_id: "",
      postal_code_id: ""
    });

  // Provincias (siempre cargan)
  const { items: provinces } = useCrud("provinces");

  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);


  const [formMode, setFormMode] = useState("create"); // create / edit
  const [idToDelete, setIdToDelete] = useState(null); 
  const [alertType, setAlertType] = useState("success"); 
  const [alertMessage, setAlertMessage] = useState("");

  /**
   * === Crear Cliente ===
   */
  const handleCreate = () => {
    setFormMode("create");
    resetForm();
    formModal.show();
  };

  /**
   * === Editar Cliente ===
   * Carga los datos del Cliente en el formulario
   */
const handleEdit = async (id) => {
  setFormMode("edit");
  const response = await getItem(id);
  const item = response.data;

  if (!item) return;

  setFormData({
    id: item.id,
    nif: item.nif,
    email: item.email,
    name: item.name,
    phone: item.phone,
    address: item.address,
    address_extra: item.address_extra,
    province_id: item.postal_code?.city?.province?.id || "",
    city_id: item.postal_code?.city?.id || "",
    postal_code_id: item.postal_code?.id || ""
  });

  // Cargar select de ciudades
  if(item.postal_code?.city?.province?.id){
    const citiesRes = await getAbsolute(`/cities/province/${item.postal_code.city.province.id}`);
    setCities(citiesRes.data || []);
  }

  // Cargar select de códigos postales
  if(item.postal_code?.city?.id){
    const postalRes = await getAbsolute(`/postal-codes/city/${item.postal_code.city.id}`);
    setPostalCodes(postalRes.data || []);
  }

  formModal.show();
};


  /**
   * === Guardar Cliente ===
   * Diferencia entre crear y actualizar
   */
  const handleSubmit = async () => {
    try {
      let res;
      if (formMode === "create") {
        res = await create(formData);
      } else {
        res = await update(formData.id, formData);
      }
      setAlertType("success");
      setAlertMessage(res.message);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }

    formModal.hide();
    alertModal.show();
    loadData();
  };

  /**
   * === Eliminar Cliente ===
   */
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    confirmModal.show();
  };

  const confirmDelete = async () => {
    try {
      const res = await remove(idToDelete);
      setAlertType("success");
      setAlertMessage(res.message);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }

    confirmModal.hide();
    alertModal.show();
    loadData();
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto">
          <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Clientes</h1>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6 width-80">
              <Button width="150px" onClick={handleCreate}>+ Nuevo Cliente</Button>
            </div>

            {/* Tabla con scroll horizontal en móviles */}
            <div className="overflow-x-auto">
              <CustomersList
                customers={Array.isArray(customers) ? customers : customers?.data || []}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>

          </div>
        </main>
      </div>

      <Footer />

      {/* Modal formulario */}
      <Modal
        open={formModal.open}
        title={formMode === "create" ? "Nuevo Cliente" : "Editar Cliente"}
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          <input type="text" value={formData.nif} placeholder="NIF" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("nif", e.target.value)} />
          <input type="text" value={formData.name} placeholder="Nombre" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("name", e.target.value)} />
          <input type="text" value={formData.phone} placeholder="Teléfono" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("phone", e.target.value)} />
          <input type="text" value={formData.address} placeholder="Dirección" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("address", e.target.value)} />
          <input type="text" value={formData.address_extra} placeholder="Casa, Apartamento, etc. (Opcional)" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("address_extra", e.target.value)} />
          <input type="text" value={formData.email} placeholder="Email" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("email", e.target.value)} />
          <select
            value={formData.province_id || ""}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={async (e) => {
              const provinceId = Number(e.target.value);

              updateForm("province_id", provinceId);
              updateForm("city_id", "");
              updateForm("postal_code_id", "");

              setCities([]);
              setPostalCodes([]);

              if (provinceId) {
                const res = await getAbsolute(`/cities/province/${provinceId}`);
                setCities(res.data || []);
              }
            }}
          >
            <option value="">Seleccione una provincia</option>
            {provinces?.data?.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
          <select
            value={formData.city_id || ""}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            disabled={!formData.province_id}
            onChange={async (e) => {
              const cityId = Number(e.target.value);

              updateForm("city_id", cityId);
              updateForm("postal_code_id", "");

              setPostalCodes([]);

              if (cityId) {
                const res = await getAbsolute(`/postal-codes/city/${cityId}`);
                setPostalCodes(res.data || []);
              }
            }}
          >
            <option value="">Seleccione una ciudad</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={formData.postal_code_id || ""}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            disabled={!formData.city_id}
            onChange={(e) =>
              updateForm("postal_code_id", Number(e.target.value))
            }
          >
            <option value="">Seleccione un código postal</option>
            {postalCodes.map(p => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este Cliente?" />

      {/* Modal de alerta */}
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}
