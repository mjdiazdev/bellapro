import { useState, useEffect } from "react";

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
  const { items: shippingMethods } = useCrud("shippingMethods"); 
  const availableMethods = Array.isArray(shippingMethods?.data) ? shippingMethods.data : [];

  const [isLoadingCP, setIsLoadingCP] = useState(false);

  // Estado temporal para la fila de ubicación que se está escribiendo
  const [tempLocation, setTempLocation] = useState({
    postal_code: "",
    postal_code_id: "",
    province_name: "",
    city_name: "",
    address: ""
  });

  // Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Formulario - Ahora manejamos un array de "locations"
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } = useForm({
    name: "",
    email: "",
    phone: "",
    user_id: "", // <--- AGREGA ESTA LÍNEA
    shipping_methods: [],
    locations: [] 
  });

  const [formMode, setFormMode] = useState("create");
  const [idToDelete, setIdToDelete] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  /** === Acciones de Ubicación === */

  const handleSearchCP = async (e) => {
    const cpValue = e.target.value;
    setTempLocation(prev => ({ ...prev, postal_code: cpValue }));

    if (cpValue.length === 5) {
      setIsLoadingCP(true);
      try {
        const res = await getAbsolute(`/postal-codes/lookup/${cpValue}`);
        const data = res.data;

        if (data && data.city) {
          setTempLocation(prev => ({
            ...prev,
            postal_code_id: data.id,
            province_name: data.city.province?.name || "",
            city_name: data.city.name || ""
          }));
        }
      } catch (error) {
        console.error("CP no encontrado");
      } finally {
        setIsLoadingCP(false);
      }
    }
  };

  const addLocationToTable = () => {
    if (!tempLocation.postal_code_id || !tempLocation.address) {
      alert("Por favor, complete el CP y la dirección antes de agregar.");
      return;
    }
    
    const newLocations = [...(formData.locations || []), { ...tempLocation }];
    updateForm("locations", newLocations);
    
    // Limpiar campos temporales
    setTempLocation({
      postal_code: "",
      postal_code_id: "",
      province_name: "",
      city_name: "",
      address: ""
    });
  };

  const removeLocation = (index) => {
    const filtered = formData.locations.filter((_, i) => i !== index);
    updateForm("locations", filtered);
  };

  /** === Acciones CRUD === */

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
    setTempLocation({ postal_code: "", postal_code_id: "", province_name: "", city_name: "", address: "" });
    formModal.show();
  };

  const handleEdit = async (id) => {
    setFormMode("edit");
    const response = await getItem(id);
    const item = response.data;

    if (!item) return;

    setFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      // Convertimos a String para que el <select> lo reconozca
      user_id: item.user_id ? String(item.user_id) : "", 
      shipping_methods: item.shipping_methods?.map(m => m.id) || [],
      locations: item.locations?.map(loc => ({
        postal_code: loc.postal_code?.code || "",
        postal_code_id: loc.postal_code_id,
        province_name: loc.postal_code?.city?.province?.name || "",
        city_name: loc.postal_code?.city?.name || "",
        address: loc.address
      })) || []
    });
    
    formModal.show();
  };

  const handleSubmit = async () => {
    if (formData.locations.length === 0) {
      setAlertType("error");
      setAlertMessage("Debe agregar al menos una ubicación al centro.");
      alertModal.show();
      return;
    }

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

  const [coordinators, setCoordinators] = useState([]);
  // Cargar coordinadores al montar el componente
  useEffect(() => {
      const fetchCoordinators = async () => {
          try {
              const res = await getAbsolute('/users/role/coordinador');
              // Dependiendo de tu respuesta, ajusta el acceso a la data
              setCoordinators(res.data || res); 
          } catch (error) {
              console.error("Error cargando coordinadores:", error);
          }
      };
      fetchCoordinators();
  }, []);

  const confirmDelete = async () => {
    try {
      const res = await remove(idToDelete);
      setAlertType("success");
      setAlertMessage(res.message || "Eliminado correctamente");
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al eliminar");
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
                onDelete={(id) => { setIdToDelete(id); confirmModal.show(); }}
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />

      <Modal 
        open={formModal.open} 
        title={formMode === "create" ? "Nuevo Centro" : "Editar Centro"} 
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Datos Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Coordinador Responsable</label>
                <select 
                    value={String(formData.user_id || "")} // Aseguramos string aquí también
                    onChange={e => updateForm("user_id", e.target.value)}
                    className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
                >
                    <option value="">Seleccione un coordinador...</option>
                    {coordinators.map(user => (
                        <option key={user.id} value={String(user.id)}>
                            {user.name} — {user.email}
                        </option>
                    ))}
                </select>
            </div>
            <input type="text" placeholder="Nombre" value={formData.name} className="border p-3 rounded-lg" onChange={e => updateForm("name", e.target.value)} />
            <input type="email" placeholder="Email" value={formData.email} className="border p-3 rounded-lg" onChange={e => updateForm("email", e.target.value)} />
            <input type="text" placeholder="Teléfono" value={formData.phone} className="border p-3 rounded-lg" onChange={e => updateForm("phone", e.target.value)} />
          </div>

          {/* Métodos de Envío */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="text-sm font-bold text-gray-700 mb-2">Métodos de Envío:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableMethods.map(method => (
                <label key={method.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                  <input type="checkbox" className="accent-pink" checked={formData.shipping_methods?.includes(method.id)} onChange={() => handleMethodToggle(method.id)} />
                  <span className="text-sm text-gray-600">{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Formulario de Ubicaciones (Zonas de Cobertura) */}
          <div className="border-t pt-4">
            <p className="text-sm font-bold text-pink-600 mb-3 uppercase">Configuración de Zonas / Ubicaciones</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <input 
                type="text" 
                placeholder="CP" 
                value={tempLocation.postal_code} 
                className={`border p-2 rounded-lg text-sm ${isLoadingCP ? 'animate-pulse border-pink-300' : ''}`}
                onChange={handleSearchCP} 
              />
              <input type="text" placeholder="Provincia" value={tempLocation.province_name} disabled className="border p-2 rounded-lg bg-gray-100 text-sm" />
              <input type="text" placeholder="Ciudad" value={tempLocation.city_name} disabled className="border p-2 rounded-lg bg-gray-100 text-sm" />
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Dirección física de este punto" 
                value={tempLocation.address} 
                className="border p-2 rounded-lg text-sm flex-1" 
                onChange={e => setTempLocation({...tempLocation, address: e.target.value})}
              />
              <button 
                type="button" 
                onClick={addLocationToTable}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Pequeña Tabla de Ubicaciones Agregadas */}
          <div className="border rounded-lg overflow-hidden shadow-sm mt-2">
            <div className="max-h-48 overflow-y-auto custom-scrollbar"> 
              {/* max-h-48 equivale a unos 192px, suficiente para ver 4 filas cómodamente */}
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                  {/* Usamos sticky top-0 para que el encabezado no se pierda al bajar */}
                  <tr>
                    <th className="p-2">CP</th>
                    <th className="p-2">Ciudad</th>
                    <th className="p-2">Dirección</th>
                    <th className="p-2 text-center">X</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {formData.locations?.length > 0 ? (
                    formData.locations.map((loc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-2 font-medium">{loc.postal_code}</td>
                        <td className="p-2">{loc.city_name}</td>
                        <td className="p-2 truncate max-w-[120px]" title={loc.address}>
                          {loc.address}
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeLocation(index)} 
                            className="text-red-500 hover:scale-110 transform transition p-1"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400 italic">
                        No hay ubicaciones agregadas aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4">
            <Button width="100%" onClick={handleSubmit}>Guardar Centro de Distribución</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este centro?" />
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}