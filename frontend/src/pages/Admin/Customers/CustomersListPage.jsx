import { useState, useEffect } from "react";

// Layout & UI
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import CustomersList from "../../../components/Admin/Customers/CustomersList";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";
import Button from "../../../components/common/variant/Button";
import PaginationControls from "../../../components/common/PaginationControls";

// Hooks
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import { getAbsolute } from "../../../services/apiService";

export default function CustomersListPage() {
  const RESOURCE = "customers";

  // --- ESTADOS DE PAGINACIÓN ---
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 1. Hook CRUD:
   * 'false' indica que la carga NO es automática (la manejamos con useEffect).
   */
  const { items: customersData, loadData, getItem, create, update, remove } = useCrud(RESOURCE, false); 

  // Modales y Alertas
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

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
   * 2. EFECTO DE CARGA:
   * Se dispara cuando cambian los controles de paginación.
   */
  useEffect(() => {
    loadData({ per_page: perPage, page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, currentPage]);

  /**
   * === LÓGICA DE FORMULARIO ===
   */
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

    // Precarga de selects anidados
    if(item.postal_code?.city?.province?.id){
      const res = await getAbsolute(`/cities/province/${item.postal_code.city.province.id}`);
      setCities(res.data || []);
    }
    if(item.postal_code?.city?.id){
      const res = await getAbsolute(`/postal-codes/city/${item.postal_code.city.id}`);
      setPostalCodes(res.data || []);
    }
    formModal.show();
  };

  const handleSubmit = async () => {
    try {
      let res = (formMode === "create") ? await create(formData) : await update(formData.id, formData);
      setAlertType("success");
      setAlertMessage(res.message);
      loadData({ per_page: perPage, page: currentPage }); // Refrescar lista
      formModal.hide();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al guardar");
    }

    formModal.hide();
    alertModal.show();
    loadData();
  };

  const confirmDelete = async () => {
    try {
      const res = await remove(idToDelete);
      setAlertType("success");
      setAlertMessage(res.message);
      loadData({ per_page: perPage, page: currentPage });
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    confirmModal.hide();
    alertModal.show();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        {/* Contenido principal */}
        <main className="flex-1 md:ml-64 bg-gray-50 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Contenido Superior (La tarjeta con la tabla) */}
          <div className="flex-grow p-4 md:p-6">
            <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">
              
              {/* Selector de cantidad (Arriba) */}
              <PaginationControls 
                  perPage={perPage} 
                  setPerPage={setPerPage} 
                  setCurrentPage={setCurrentPage}
                  onlySelector={true} 
              />

              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                <Button width="150px" onClick={handleCreate}>+ Nuevo Cliente</Button>
              </div>

              <div className="overflow-x-auto">
                <CustomersList
                  customers={customersData?.data || []} // Acceso a data del paginador
                  onEdit={handleEdit}
                  onDelete={(id) => { setIdToDelete(id); confirmModal.show(); }}
                />
                
                {/* Navegación (Abajo) */}
                <PaginationControls 
                    currentPage={currentPage}
                    lastPage={customersData?.last_page}
                    setCurrentPage={setCurrentPage}
                    from={customersData?.from}
                    to={customersData?.to}
                    total={customersData?.total}
                />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Modales se mantienen igual, solo asegúrate de que el select de provincias use provinces.data */}
      <Modal open={formModal.open} title={formMode === "create" ? "Nuevo Cliente" : "Editar Cliente"} onClose={formModal.hide}>
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

      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este Cliente?" />
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}