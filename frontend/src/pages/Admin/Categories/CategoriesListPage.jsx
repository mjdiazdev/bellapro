import { useState } from "react";
// Componentes comunes
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";
import Button from "../../../components/common/variant/Button";

// Componentes específicos
import CategoriesList from "../../../components/Admin/Categories/CategoriesList";

// Hooks reutilizables
import useCrud from "../../../hooks/useCrud"; // Maneja operaciones CRUD genéricas
import useModal from "../../../hooks/useModal"; // Controla apertura/cierre de modales
import useForm from "../../../hooks/useForm"; // Hook para formularios controlados

export default function CategoriesListPage() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // ------------------------------
  // 1. Configuración del recurso
  // ------------------------------
  // Definimos el recurso que manejaremos; debe coincidir con el endpoint en la API
  const RESOURCE = "categories";

  // useCrud retorna las funciones CRUD y los items del recurso
  const { items: categories, loadData, getItem, create, update, remove } = useCrud(RESOURCE);

  // ------------------------------
  // 2. Modales
  // ------------------------------
  const confirmModal = useModal(); // Modal de confirmación (eliminar)
  const formModal = useModal(); // Modal para crear/editar
  const alertModal = useModal(); // Modal para alertas de éxito/error

  // ------------------------------
  // 3. Formulario controlado
  // ------------------------------
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } = useForm({
    name: "",
    code: ""
  });

  // Estado para saber si el formulario está en modo "create" o "edit"
  const [formMode, setFormMode] = useState("create");

  // Guardar temporalmente el ID a eliminar
  const [idToDelete, setIdToDelete] = useState(null);

  // Estados para el modal de alertas
  const [alertType, setAlertType] = useState("success"); // "success" | "error"
  const [alertMessage, setAlertMessage] = useState("");

  // Estado activo del sidebar para resaltarlo
  const [activeItem, setActiveItem] = useState('Dashboard');

  // ------------------------------
  // 4. Funciones CRUD
  // ------------------------------

  // Abrir modal para crear nueva categoría
  const handleCreate = () => {
    setFormMode("create"); // modo crear
    resetForm(); // limpiar formulario
    formModal.show(); // mostrar modal
  };

  // Abrir modal para editar categoría existente
  const handleEdit = async (id) => {
    setFormMode("edit"); // modo editar
    const item = await getItem(id); // obtener categoría desde API
    setFormData(item); // cargar datos en el formulario
    formModal.show(); // mostrar modal
  };

  // Guardar cambios (crear o actualizar)
  const handleSubmit = async () => {
    try {
      let res;
      if (formMode === "create") {
        res = await create(formData); // crear
      } else {
        res = await update(formData.id, formData); // actualizar
      }
      setAlertType("success");
      setAlertMessage(res.message);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    formModal.hide(); // cerrar modal de formulario
    alertModal.show(); // mostrar alerta
    loadData(); // refrescar tabla
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    confirmModal.show();
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      const res = await remove(idToDelete); // eliminar desde API
      setAlertType("success");
      setAlertMessage(res.message);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    confirmModal.hide();
    alertModal.show();
    loadData(); // refrescar tabla
  };

  // ------------------------------
  // 5. Renderizado de la página
  // ------------------------------
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      {/* Header de la aplicación */}
      <Header />

      {/* Contenedor principal: Sidebar + contenido */}
      <div className="flex flex-1">
        
        {/* Sidebar: recibe estado activo y setter */}
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        {/* Contenido principal */}
        <main className="flex-1 md:ml-64 bg-gray-50 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Contenido Superior (La tarjeta con la tabla) */}
          <div className="flex-grow p-4 md:p-6">
            <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">

              {/* Título */}
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Categorías</h1>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
                {/* Crear categoría */}
                <Button width="150px" onClick={handleCreate}>+ Nueva Categoría</Button>

                {/* Descargar PDF */}
                <Button width="250px">
                <a 
                  href={`${BACKEND_URL}/categories/qrs/pdf`}
                  target="_blank"
                  rel="noopener noreferrer" // ⚠ Seguridad: evitar riesgos con target="_blank"
                >
                  <i className="fas fa-file-pdf"></i> Descargar QR en PDF
                </a>
                </Button>
              </div>

              {/* Tabla responsive */}
              <div className="overflow-x-auto">
                <CategoriesList
                  categories={Array.isArray(categories?.data) ? categories.data : []} // <-- acceder a products.data
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </main>
      </div>
      {/* Modales */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={confirmModal.hide}
        onConfirm={confirmDelete}
        message="¿Seguro deseas eliminar esta categoría?"
      />

      <Modal
        open={formModal.open}
        title={formMode === "create" ? "Nueva Categoría" : "Editar Categoría"}
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          {/* Input Nombre */}
          <input
            type="text"
            value={formData.name}
            placeholder="Nombre"
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("name", e.target.value)}
          />

          {/* Input Código */}
          <input
            type="text"
            value={formData.code}
            placeholder="Código"
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("code", e.target.value)}
          />

          {/* Botón Guardar */}
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </Modal>
      {/* Alerta Modal */}
      <AlertModal
        open={alertModal.open}
        type={alertType}
        message={alertMessage}
        onClose={alertModal.hide}
      />

    </div>
  );
}
