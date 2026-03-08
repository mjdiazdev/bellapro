// src/pages/Admin/ShippingMethods/ShippingMethodsPage.jsx
import { useState } from "react";

// Comunes
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";
import Button from "../../../components/common/variant/Button";

// Específicos
import ShippingMethodsList from "../../../components/Admin/ShippingMethods/ShippingMethodsList";

// Hooks
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";

export default function ShippingMethodsPage() {
  // ------------------------------
  // 1. Recurso
  // ------------------------------
  const RESOURCE = "shippingMethods";
  const { items, loadData, getItem, create, update, remove } = useCrud(RESOURCE);

  // ------------------------------
  // 2. Modales
  // ------------------------------
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // ------------------------------
  // 3. Formulario
  // ------------------------------
  const { data: formData, update: updateForm, setData, reset } = useForm({
    name: "",
    description: "",
    price: "",
  });

  const [formMode, setFormMode] = useState("create");
  const [idToDelete, setIdToDelete] = useState(null);

  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const [activeItem, setActiveItem] = useState("ShippingMethods");

  // ------------------------------
  // 4. Acciones
  // ------------------------------
  const handleCreate = () => {
    setFormMode("create");
    reset();
    formModal.show();
  };

  const handleEdit = async (id) => {
    setFormMode("edit");
    const response = await getItem(id);
    const item = response.data;
    setData(item);
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
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    formModal.hide();
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

  // ------------------------------
  // 5. Render
  // ------------------------------
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <main className="flex-1 md:ml-64 bg-gray-50 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Contenido Superior (La tarjeta con la tabla) */}
          <div className="flex-grow p-4 md:p-6">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">

              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Métodos de envío
              </h1>

              <div className="flex justify-end mb-6">
                <Button width="220px" onClick={handleCreate}>
                  + Nuevo método de envío
                </Button>
              </div>

              {/* Tabla con scroll horizontal en móviles */}
              <div className="overflow-x-auto">
                <ShippingMethodsList
                  shippingMethods={Array.isArray(items?.data) ? items.data : []}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>            
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Modales */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={confirmModal.hide}
        onConfirm={confirmDelete}
        message="¿Seguro deseas eliminar este método de envío?"
      />

      <Modal
        open={formModal.open}
        title={
          formMode === "create"
            ? "Nuevo método de envío"
            : "Editar método de envío"
        }
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => updateForm("name", e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => updateForm("description", e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={formData.price}
            onChange={(e) => updateForm("price", e.target.value)}
            className="border p-3 rounded-lg"
          />

          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </Modal>

      <AlertModal
        open={alertModal.open}
        type={alertType}
        message={alertMessage}
        onClose={alertModal.hide}
      />
    </div>
  );
}
