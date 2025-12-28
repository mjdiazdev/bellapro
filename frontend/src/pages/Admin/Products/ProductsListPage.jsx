/**
 * Página: ProductsListPage
 * ========================
 * Página de administración de productos.
 * Utiliza hooks reutilizables:
 * - useCrud → CRUD para productos
 * - useModal → control de modales
 * - useForm → formulario controlado
 *
 * Componentes principales:
 * - Header / Sidebar / Footer → Layout
 * - ProductsList → Tabla de productos
 * - Modal / ConfirmModal / AlertModal → Modales
 */

import { useState } from "react";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";

import Button from "../../../components/common/variant/Button";

import ProductsList from "../../../components/Admin/Products/ProductsList";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";

import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";

export default function ProductsListPage() {
  // Endpoint del recurso
  const RESOURCE = "products";

  // Hook CRUD
  const { items: products, loadData, getItem, create, update, remove } = useCrud(RESOURCE);

  // Hook CRUD para categorías (para el select)
  const { items: categories } = useCrud("categories");
  const categoryOptions = Array.isArray(categories?.data) ? categories.data : [];

  // Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Formulario controlado
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } =
    useForm({ name: "", reference: "", price: "", description: "", category_id: "", photo_url: "" });

  const [formMode, setFormMode] = useState("create"); // create / edit
  const [idToDelete, setIdToDelete] = useState(null); 
  const [alertType, setAlertType] = useState("success"); 
  const [alertMessage, setAlertMessage] = useState("");

  /**
   * === Crear producto ===
   */
  const handleCreate = () => {
    setFormMode("create");
    resetForm();
    formModal.show();
  };

  /**
   * === Editar producto ===
   * Carga los datos del producto en el formulario
   */
  const handleEdit = async (id) => {
    setFormMode("edit");
    const response = await getItem(id);
    const item = response.data; 

    if (!item) return;

    setFormData({
    id: item.id,
    name: item.name,
    reference: item.reference,
    price: item.price,
    description: item.description,
    photo_url: item.photo_url,
    category_id: item.category_id
    });

    formModal.show();
  };

  /**
   * === Guardar producto ===
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
   * === Eliminar producto ===
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

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Productos</h1>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
              <Button width="150px" onClick={handleCreate}>+ Nuevo Producto</Button>
            </div>

            {/* Tabla con scroll horizontal en móviles */}
            <div className="overflow-x-auto">
                <ProductsList
                products={Array.isArray(products?.data) ? products.data : []} // <-- acceder a products.data
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
        title={formMode === "create" ? "Nuevo Producto" : "Editar Producto"}
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          <input type="text" value={formData.name} placeholder="Nombre" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("name", e.target.value)} />
          <input type="text" value={formData.reference} placeholder="Referencia" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("reference", e.target.value)} />
          <input type="number" value={formData.price} placeholder="Precio" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("price", e.target.value)} />
          <input type="text" value={formData.description} placeholder="Descripción" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("description", e.target.value)} />
          <input type="text" value={formData.photo_url} placeholder="URL de la foto" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("photo_url", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
                value={formData.category_id || ""}
                onChange={(e) => updateForm("category_id", Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink transition-colors"
            >
                <option value="">Seleccione una categoría</option>
                {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.code} - {cat.name}
                </option>
                ))}
            </select>
            </div>


          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este producto?" />

      {/* Modal de alerta */}
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}
