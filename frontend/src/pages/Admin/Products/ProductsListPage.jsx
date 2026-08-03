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
import BulkImportButton from "../../../components/Admin/Products/BulkImportButton";
import PaginationControls from "../../../components/common/PaginationControls";

// Hooks & Services
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import { bulkUpdateItems } from "../../../services/apiService"; // Importar servicio bulk

export default function ProductsListPage() {
  const RESOURCE = "products";

  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // 1. Hook CRUD: Obtenemos las funciones básicas
  const { 
    items: products, 
    loadData, 
    getItem, 
    create, 
    update, 
    remove 
  } = useCrud(RESOURCE, false);
  
  // 2. Estado local para edición masiva: 
  // Esto permite que el usuario edite la tabla sin afectar la DB inmediatamente
  const [localProducts, setLocalProducts] = useState([]);

  // 3. Sincronizar estado local cuando los productos carguen desde el Backend
  // EFECTO 1: Cargar datos del servidor cuando cambian los filtros/paginación
  useEffect(() => {
    // Solo disparamos la carga si cambian los valores de paginación o la búsqueda
    loadData({ per_page: perPage, page: currentPage, search: search || undefined });
  }, [perPage, currentPage, search]);

  // Cada vez que cambia el término de búsqueda, volvemos a la página 1
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // EFECTO 2: Sincronizar productos del servidor al estado local
  useEffect(() => {
    if (products?.data) {
      setLocalProducts(products.data);
      setSelectedIds(new Set());
    }
  }, [products?.data]); // Escuchamos específicamente al array de datos, no al objeto completo

  // Hook para categorías (select del modal)
  const { items: categories } = useCrud("categories");
  const categoryOptions = Array.isArray(categories?.data) ? categories.data : [];

  // Control de Modales
  const confirmModal = useModal();
  const formModal = useModal();
  const alertModal = useModal();

  // Hook de Formulario (para crear/editar registro individual)
  const { data: formData, update: updateForm, setData: setFormData, reset: resetForm } =
  useForm({ 
    name: "", 
    reference: "", 
    price: "", 
    description: "", 
    category_id: "", 
    stock: "",
    image_file: null 
  });

  const [formMode, setFormMode] = useState("create");
  const [idToDelete, setIdToDelete] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // === SELECCIÓN MASIVA ===
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === localProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(localProducts.map(p => p.id)));
    }
  };

  const handleApplyToSelected = async () => {
    if (selectedIds.size === 0) return;
    if (bulkPrice === "" && bulkStock === "") return;

    // Construir los items afectados con los valores nuevos
    const itemsToSave = localProducts
      .filter(p => selectedIds.has(p.id))
      .map(p => ({
        id: p.id,
        price: bulkPrice !== "" ? bulkPrice : p.price,
        stock: bulkStock !== "" ? Number(bulkStock) : (p.stock?.stock ?? 0),
      }));

    // Actualizar estado local
    setLocalProducts(prev => prev.map(p => {
      if (!selectedIds.has(p.id)) return p;
      let updated = { ...p };
      if (bulkPrice !== "") updated = { ...updated, price: bulkPrice };
      if (bulkStock !== "") updated = { ...updated, stock: { ...p.stock, stock: Number(bulkStock) } };
      return updated;
    }));

    setBulkPrice("");
    setBulkStock("");

    // Guardar directamente en DB solo los productos afectados
    try {
      const res = await bulkUpdateItems(RESOURCE, { items: itemsToSave });
      setAlertType("success");
      setAlertMessage(res.message);
      loadData();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al guardar los cambios");
    }
    alertModal.show();
  };

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
          stock: p.stock?.stock ?? 0,
          status: p.status ?? true
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
      stock: item.stock ? item.stock.stock : 0,
      status: item.status,
    });
    formModal.show();
  };

  const handleSubmit = async () => {
    try {
      // 1. Crear el contenedor FormData
      const payload = new FormData();
      
      // 2. Llenar con los campos del formulario
      payload.append("name", formData.name);
      payload.append("reference", formData.reference);
      payload.append("price", formData.price);
      payload.append("description", formData.description || "");
      payload.append("category_id", formData.category_id);
      payload.append("stock", formData.stock);

      // 3. Agregar la imagen solo si el usuario seleccionó una nueva
      if (formData.image_file) {
        payload.append("image", formData.image_file);
      }

      let res;
      if (formMode === "create") {
        res = await create(payload); // useCrud llamará a apiService.createItem
      } else {
        res = await update(formData.id, payload); // useCrud llamará a apiService.updateItem
      }

      setAlertType("success");
      setAlertMessage(res.message);
      loadData();
      formModal.hide();
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al procesar la solicitud");
    }
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

  /**
   * === IMPORTACIÓN MASIVA ===
   */
  const handleImportSuccess = (message) => {
    setAlertType("success");
    setAlertMessage(message);
    alertModal.show();
    loadData(); // Recarga la tabla
  };

  const handleImportError = (message) => {
    setAlertType("warning");
    setAlertMessage(message);
    alertModal.show();
  };
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 md:ml-64 bg-gray-50 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Contenido Superior (La tarjeta con la tabla) */}
          <div className="flex-grow p-4 md:p-6">
            <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">

              <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Productos</h1>
              <PaginationControls 
                  perPage={perPage} 
                  setPerPage={setPerPage} 
                  setCurrentPage={setCurrentPage}
                  onlySelector={true} // Podrías pasarle un prop para mostrar solo el select
              />
              {/* Botones de acción principales */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
                <BulkImportButton 
                  onImportSuccess={handleImportSuccess}
                  onImportError={handleImportError}
                />
                <Button width="150px" onClick={handleCreate}>+ Nuevo Producto</Button>
              </div>

              {/* Barra de aplicación masiva — visible solo cuando hay filas seleccionadas */}
              {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <span className="text-sm font-semibold text-pink-700">
                    {selectedIds.size} producto{selectedIds.size > 1 ? 's' : ''} seleccionado{selectedIds.size > 1 ? 's' : ''}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio (€)"
                    value={bulkPrice}
                    onChange={e => setBulkPrice(e.target.value)}
                    className="w-32 p-2 border border-pink-300 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={bulkStock}
                    onChange={e => setBulkStock(e.target.value)}
                    className="w-28 p-2 border border-pink-300 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                  <button
                    onClick={handleApplyToSelected}
                    className="px-4 py-2 bg-pink-500 text-white text-sm font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Aplicar a seleccionados
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Deseleccionar todo
                  </button>
                </div>
              )}

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
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    onSearchChange={handleSearchChange}
                  />
                  <PaginationControls 
                      currentPage={currentPage}
                      lastPage={products?.last_page}
                      setCurrentPage={setCurrentPage}
                      from={products?.from}
                      to={products?.to}
                      total={products?.total}
                  />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

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
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Imagen del Producto</label>
            <input 
              type="file" 
              accept="image/*"
              className="border border-gray-300 rounded-lg p-2 text-sm"
              onChange={e => updateForm("image_file", e.target.files[0])} // Guardamos el archivo
            />
            {/* Previsualización */}
            {formData.image_file && (
              <p className="text-xs text-pink font-medium">Archivo seleccionado: {formData.image_file.name}</p>
            )}
          </div>
          
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