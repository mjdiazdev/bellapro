import { useEffect, useState } from "react";

// Layout & Components
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import OrdersList from "../../../components/Admin/Orders/OrdersList";
import PaginationControls from "../../../components/common/PaginationControls";
import AlertModal from "../../../components/common/AlertModal"; // Importamos para feedback

// Hooks & Services
import useCrud from "../../../hooks/useCrud";
import useModal from "../../../hooks/useModal";
import apiService from "../../../services/apiService"; // Asegúrate de que esta sea tu ruta real
import { postAbsolute } from "../../../services/apiService";

export default function OrdersListPage() {
  const RESOURCE = "orders";

  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para el modal de alerta
  const alertModal = useModal();
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const { items: ordersData, loadData } = useCrud(RESOURCE, false);

  useEffect(() => {
    loadData({ per_page: perPage, page: currentPage });
  }, [perPage, currentPage]);

  /**
   * === LÓGICA DE ACTUALIZACIÓN MASIVA ===
   * Esta función se pasa como prop a OrdersList
   */
  const handleBulkStatusChange = async (ids, newStatus) => {
    try {
      // 2. Usamos postAbsolute con la ruta manual que definimos en api.php
      // IMPORTANTE: Verifica si tu 'api.js' ya pone el prefijo /api. 
      // Si no, usa "/api/orders/bulk-status"
      const response = await postAbsolute("/orders/bulk-status", {
        ids: ids,
        status: newStatus
      });

      setAlertType("success");
      setAlertMessage(response.message || "Pedidos actualizados correctamente");
      alertModal.show();
      loadData({ per_page: perPage, page: currentPage });
    } catch (error) {
      console.error("Error en la petición:", error.response?.data);
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Error al actualizar los pedidos");
      alertModal.show();
    }
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
              
              <PaginationControls 
                  perPage={perPage} 
                  setPerPage={setPerPage} 
                  setCurrentPage={setCurrentPage}
                  onlySelector={true} 
              />

              <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Pedidos</h1>

              <div className="overflow-x-auto">
                <OrdersList 
                  orders={ordersData?.data || []} 
                  onBulkStatusChange={handleBulkStatusChange} // <-- Pasamos la función aquí
                />
                
                <PaginationControls 
                    currentPage={currentPage}
                    lastPage={ordersData?.last_page}
                    setCurrentPage={setCurrentPage}
                    from={ordersData?.from}
                    to={ordersData?.to}
                    total={ordersData?.total}
                />
              </div>            
            </div>
          </div>
          <Footer />
        </main>
      </div>


      {/* Modal para mostrar éxito o error */}
      <AlertModal 
        open={alertModal.open} 
        type={alertType} 
        message={alertMessage} 
        onClose={alertModal.hide} 
      />
    </div>
  );
}