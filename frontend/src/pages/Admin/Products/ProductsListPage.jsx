import { useState, useEffect } from "react";

// Layout & Components
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Button from "../../../components/common/variant/Button";
import ProductsList from "../../../components/Admin/Products/ProductsList";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";
import AlertModal from "../../../components/common/AlertModal";

// Hooks & Services
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import { bulkUpdateItems } from "../../../services/apiService"; // Importar servicio bulk

export default function ProductsListPage() {
  const RESOURCE = "products";

  // 1. Hook CRUD: Obtenemos las funciones básicas
  const { items: products, loadData, getItem, create, update, remove } = useCrud(RESOURCE);
  
  // 2. Estado local para edición masiva: 
  // Esto permite que el usuario edite la tabla sin afectar la DB inmediatamente
  const [localProducts, setLocalProducts] = useState([]);

  // 3. Sincronizar estado local cuando los productos carguen desde el Backend
  useEffect(() => {
    if (products?.data) {
      setLocalProducts(products.data);
    }
  }, [products]);

  // Hook para categorías (select del modal)
  const { items: categories } = useCrud("categories");
  const categoryOptions = Array.isArray(categories?.data) ? categories.data : [];

  // Control de Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Hook de Formulario (para crear/editar registro individual)
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } =
    useForm({ name: "", reference: "", price: "", description: "", category_id: "", photo_url: "", stock: 0 });

  const [formMode, setFormMode] = useState("create");
  const [idToDelete, setIdToDelete] = useState(null); 
  const [alertType, setAlertType] = useState("success"); 
  const [alertMessage, setAlertMessage] = useState("");

  /**
   * === LÓGICA DE EDICIÓN EN TABLA (LOCAL) ===
   * Actualiza el estado localProducts cuando el usuario escribe en los inputs de la tabla.
   */
  const handleLocalChange = (id, field, value) => {
    setLocalProducts(prev => prev.map(item => {
      if (item.id === id) {
        if (field === 'stock') {
          // Si es stock, actualizamos el objeto anidado que espera el componente
          return { ...item, stock: { ...item.stock, stock: value } };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  /**
   * === GUARDADO MASIVO (BULK UPDATE) ===
   * Envía todos los cambios acumulados en la tabla al Backend.
   */
  const handleBulkSave = async () => {
    try {
      // Preparamos el payload exacto que espera el ProductHandler de Laravel
      const payload = {
        items: localProducts.map(p => ({
          id: p.id,
          price: p.price,
          stock: p.stock?.stock ?? 0
        }))
      };

      const res = await bulkUpdateItems(RESOURCE, payload);
      
      setAlertType("success");
      setAlertMessage(res.message);
      alertModal.show();
      loadData(); // Refrescamos datos reales del servidor después del éxito
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al actualizar masivamente");
      alertModal.show();
    }
  };

  /**
   * === CRUD: Crear / Editar / Eliminar (Individual) ===
   */
  const handleCreate = () => {
    setFormMode("create");
    resetForm();
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
      reference: item.reference,
      price: item.price,
      description: item.description,
      photo_url: item.photo_url,
      category_id: item.category_id,
      stock: item.stock ? item.stock.stock : 0
    });
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
      loadData();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    formModal.hide();
    alertModal.show();
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
      loadData();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message);
    }
    confirmModal.hide();
    alertModal.show();
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto">
          <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">
            
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Productos</h1>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
              <Button width="150px" onClick={handleCreate}>+ Nuevo Producto</Button>
            </div>

            {/* Lista de Productos:
                - Pasamos localProducts para permitir la edición en tiempo real.
                - onLocalChange captura los cambios de los inputs en la tabla.
                - onSaveAll dispara la petición Bulk al backend.
            */}
            <div className="overflow-x-auto">
                <ProductsList
                  products={localProducts}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onLocalChange={handleLocalChange}
                  onSaveAll={handleBulkSave}
                />
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Modal Formulario Individual */}
      <Modal
        open={formModal.open}
        title={formMode === "create" ? "Nuevo Producto" : "Editar Producto"}
        onClose={formModal.hide}
      >
        <div className="flex flex-col space-y-4">
          <input type="text" value={formData.name} placeholder="Nombre" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("name", e.target.value)} />
          <input type="text" value={formData.reference} placeholder="Referencia" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("reference", e.target.value)} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={formData.price} placeholder="Precio (€)" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("price", e.target.value)} />
            <input type="number" value={formData.stock} placeholder="Stock" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("stock", Number(e.target.value))} />
          </div>

          <textarea value={formData.description} placeholder="Descripción" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("description", e.target.value)} />
          <input type="text" value={formData.photo_url} placeholder="URL de la foto" className="border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink" onChange={e => updateForm("photo_url", e.target.value)} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
                value={formData.category_id || ""}
                onChange={(e) => updateForm("category_id", Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink focus:border-pink"
            >
                <option value="">Seleccione una categoría</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                      {cat.code} - {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <Button onClick={handleSubmit}>Guardar Producto</Button>
        </div>
      </Modal>

      <ConfirmModal open={confirmModal.open} onClose={confirmModal.hide} onConfirm={confirmDelete} message="¿Seguro deseas eliminar este producto?" />
      <AlertModal open={alertModal.open} type={alertType} message={alertMessage} onClose={alertModal.hide} />
    </div>
  );
}