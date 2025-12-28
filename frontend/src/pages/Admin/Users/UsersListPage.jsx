/**
 * Página: UsersListPage
 * =====================
 * Página de administración de usuarios.
 * Esta página utiliza hooks reutilizables para CRUD, modales y formularios:
 * - useCrud → operaciones CRUD sobre usuarios
 * - useModal → control de modales
 * - useForm → formulario controlado
 *
 * Componentes principales:
 * - Header / Footer / Sidebar → Layout general
 * - UsersList → Tabla de usuarios
 * - Modal, ConfirmModal, AlertModal → Modales reutilizables
 */

import { useState } from "react";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";

import Button from "../../../components/common/variant/Button";

import UsersList from "../../../components/Admin/Users/UsersList";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";

import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";

export default function UsersListPage() {
  // Endpoint de usuarios
  const RESOURCE = "users";

  // Hook CRUD → items: lista de usuarios, loadData: recarga, getItem, create, update, remove
  const { items: users, loadData, getItem, create, update, remove } =
    useCrud(RESOURCE);

  // Modales reutilizables
  const confirmModal = useModal(); // Modal de confirmación para eliminar
  const formModal = useModal();    // Modal de formulario para crear/editar
  const alertModal = useModal();   // Modal de alerta para mensajes del servidor

  // Formulario controlado
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } =
    useForm({ name: "", email: "", password: "", role: 1 });

  // Estado local
  const [formMode, setFormMode] = useState("create"); // "create" o "edit"
  const [idToDelete, setIdToDelete] = useState(null); // ID del usuario a eliminar
  const [alertType, setAlertType] = useState("success"); // Tipo de alerta
  const [alertMessage, setAlertMessage] = useState("");   // Mensaje de alerta

  /**
   * === Crear usuario ===
   * Limpia formulario y abre modal en modo "create"
   */
  const handleCreate = () => {
    setFormMode("create");
    resetForm();
    formModal.show();
  };

  /**
   * === Editar usuario ===
   * Carga datos del usuario en el formulario y abre modal en modo "edit"
   */
  const handleEdit = async (id) => {
    setFormMode("edit");
    const item = await getItem(id);

    setFormData({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      password: "", // No se muestra la contraseña actual
    });

    formModal.show();
  };

  /**
   * === Guardar usuario ===
   * Diferencia entre crear y actualizar.
   * Si el password está vacío en edición, no se envía.
   */
  const handleSubmit = async () => {
    try {
      let res;

      if (formMode === "create") {
        res = await create(formData);
      } else {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        res = await update(formData.id, payload);
      }

      setAlertType("success");
      setAlertMessage(res.message);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }

    formModal.hide();
    alertModal.show();
    loadData(); // Recargar tabla de usuarios
  };

  /**
   * === Eliminar usuario ===
   * Abre modal de confirmación
   */
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    confirmModal.show();
  };

  /**
   * === Confirmar eliminación ===
   * Llama al remove del hook CRUD y muestra alerta
   */
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
      {/* Header global */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar con responsividad */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto">
          <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">

            {/* Título de la página */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Administración de Usuarios
            </h1>

            {/* Botón Crear usuario */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
              <Button width="150px" onClick={handleCreate}>+ Nuevo Usuario</Button>
            </div>

            {/* Tabla de usuarios con scroll horizontal en móviles */}
            <div className="overflow-x-auto">
              <UsersList
                users={users}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Footer global */}
      <Footer />

      {/* Modal de formulario */}
      <Modal
        open={formModal.open}
        title={formMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          {/* Input Nombre */}
          <input
            value={formData.name}
            placeholder="Nombre"
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("name", e.target.value)}
          />

          {/* Input Email */}
          <input
            value={formData.email}
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("email", e.target.value)}
          />

          {/* Input Password */}
          <input
            value={formData.password}
            type="password"
            placeholder={formMode === "edit" ? "Nuevo password (opcional)" : "Password"}
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("password", e.target.value)}
          />

          {/* Select Rol */}
          <select
            value={formData.role}
            className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            onChange={(e) => updateForm("role", Number(e.target.value))}
          >
            <option value={1}>Administrador</option>
            <option value={2}>Usuario</option>
          </select>

          {/* Botón Guardar */}
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={confirmModal.hide}
        onConfirm={confirmDelete}
        message="¿Seguro deseas eliminar este usuario?"
      />

      {/* Modal de alerta */}
      <AlertModal
        open={alertModal.open}
        type={alertType}
        message={alertMessage}
        onClose={alertModal.hide}
      />
    </div>
  );
}
