import { useState } from "react";

// Layout y Comunes
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";
import Button from "../../../components/common/variant/Button";

// Específicos
import DistributionCentersList from "../../../components/Admin/DistributionCenters/DistributionCentersList";

// Hooks y Servicios
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import { getAbsolute } from "../../../services/apiService";

export default function DistributionCentersPage() {
  const RESOURCE = "distributionCenters";

  // CRUD Principal
  const { items: centers, loadData, getItem, create, update, remove } = useCrud(RESOURCE);

  // Datos Geográficos y Métodos de Envío
  const { items: provinces } = useCrud("provinces");
  const { items: shippingMethods } = useCrud("shippingMethods"); // Cargamos métodos disponibles
  const availableMethods = Array.isArray(shippingMethods?.data) ? shippingMethods.data : [];

  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);

  // Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Formulario - Añadimos shipping_methods como array vacío
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    province_id: "",
    city_id: "",
    postal_code_id: "",
    shipping_methods: [] // Nuevo campo para la relación muchos a muchos
  });

  const [formMode, setFormMode] = useState("create");
  const [idToDelete, setIdToDelete] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  /** === Acciones === */

  // Función para manejar el toggle de los checkboxes
  const handleMethodToggle = (methodId) => {
    const currentSelected = formData.shipping_methods || [];
    const updated = currentSelected.includes(methodId)
      ? currentSelected.filter(id => id !== methodId)
      : [...currentSelected, methodId];
    
    updateForm("shipping_methods", updated);
  };

  const handleCreate = () => {
    setFormMode("create");
    resetForm();
    setCities([]);
    setPostalCodes([]);
    formModal.show();
  };

  const handleEdit = async (id) => {
    setFormMode("edit");
    const response = await getItem(id);
    const item = response.data;

    if (!item) return;

    // Sincronizar formulario con datos anidados del backend
    setFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      province_id: item.postal_code?.city?.province?.id || "",
      city_id: item.postal_code?.city?.id || "",
      postal_code_id: item.postal_code?.id || "",
      // Mapeamos los IDs de los métodos ya asociados
      shipping_methods: item.shipping_methods?.map(m => m.id) || [] 
    });

    // Cargar selectores dependientes
    if (item.postal_code?.city?.province?.id) {
      const citiesRes = await getAbsolute(`/cities/province/${item.postal_code.city.province.id}`);
      setCities(citiesRes.data || []);
    }
    if (item.postal_code?.city?.id) {
      const postalRes = await getAbsolute(`/postal-codes/city/${item.postal_code.city.id}`);
      setPostalCodes(postalRes.data || []);
    }

    formModal.show();
  };

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
      formModal.hide();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al procesar la solicitud");
    }
    alertModal.show();
    loadData();
  };

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
        <Sidebar activeItem="DistributionCenters" />
        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto pt-24">
          <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Centros de Distribución</h1>

            <div className="flex justify-end mb-6">
              <Button width="220px" onClick={handleCreate}>+ Nuevo Centro</Button>
            </div>

            <div className="overflow-x-auto">
              <DistributionCentersList
                centers={Array.isArray(centers) ? centers : centers?.data || []}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal Formulario */}
      <Modal 
        open={formModal.open} 
        title={formMode === "create" ? "Nuevo Centro" : "Editar Centro"} 
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          <input type="text" placeholder="Nombre" value={formData.name} className="border p-3 rounded-lg" onChange={e => updateForm("name", e.target.value)} />
          <input type="email" placeholder="Email" value={formData.email} className="border p-3 rounded-lg" onChange={e => updateForm("email", e.target.value)} />
          <input type="text" placeholder="Teléfono" value={formData.phone} className="border p-3 rounded-lg" onChange={e => updateForm("phone", e.target.value)} />
          <input type="text" placeholder="Dirección" value={formData.address} className="border p-3 rounded-lg" onChange={e => updateForm("address", e.target.value)} />

          {/* Selectores Jerárquicos */}
          <select
            value={formData.province_id}
            className="border p-3 rounded-lg"
            onChange={async (e) => {
              const pId = e.target.value;
              updateForm("province_id", pId);
              updateForm("city_id", "");
              updateForm("postal_code_id", "");
              setCities([]);
              setPostalCodes([]);
              if (pId) {
                const res = await getAbsolute(`/cities/province/${pId}`);
                setCities(res.data || []);
              }
            }}
          >
            <option value="">Seleccione Provincia</option>
            {provinces?.data?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select
            value={formData.city_id}
            disabled={!formData.province_id}
            className="border p-3 rounded-lg"
            onChange={async (e) => {
              const cId = e.target.value;
              updateForm("city_id", cId);
              updateForm("postal_code_id", "");
              setPostalCodes([]);
              if (cId) {
                const res = await getAbsolute(`/postal-codes/city/${cId}`);
                setPostalCodes(res.data || []);
              }
            }}
          >
            <option value="">Seleccione Ciudad</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            value={formData.postal_code_id}
            disabled={!formData.city_id}
            className="border p-3 rounded-lg"
            onChange={e => updateForm("postal_code_id", e.target.value)}
          >
            <option value="">Seleccione C.P.</option>
            {postalCodes.map(p => <option key={p.id} value={p.id}>{p.code}</option>)}
          </select>

          {/* NUEVO: Selección de Métodos de Envío (Checkbox Group) */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="text-sm font-bold text-gray-700 mb-2">Métodos de Envío Disponibles:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableMethods.map(method => (
                <label key={method.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                  <input
                    type="checkbox"
                    className="accent-pink"
                    checked={formData.shipping_methods?.includes(method.id)}
                    onChange={() => handleMethodToggle(method.id)}
                  />
                  <span className="text-sm text-gray-600">{method.name}</span>
                </label>
              ))}
            </div>
            {availableMethods.length === 0 && (
              <p className="text-xs text-gray-400 italic">No hay métodos de envío registrados.</p>
            )}
          </div>

          <Button onClick={handleSubmit}>Guardar Centro</Button>
        </div>
      </Modal>

      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este centro?" />
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}