import { useEffect, useState } from "react";

// Layout & Components
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import OrdersList from "../../../components/Admin/Orders/OrdersList";
import PaginationControls from "../../../components/common/PaginationControls";

// Hooks
import useCrud from "../../../hooks/useCrud";

export default function OrdersListPage() {
  const RESOURCE = "orders";

  // --- ESTADOS DE PAGINACIÓN ---
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 1. Hook CRUD:
   * Usamos 'false' en el segundo parámetro para que NO cargue automáticamente,
   * ya que nosotros controlaremos la carga con el useEffect de abajo 
   * pasando los parámetros de paginación.
   */
  const { items: ordersData, loadData } = useCrud(RESOURCE, false);

  /**
   * 2. Sincronización con el Backend:
   * Cada vez que cambie la página o la cantidad por página,
   * pedimos los nuevos datos al servidor.
   */
  useEffect(() => {
    loadData({ per_page: perPage, page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, currentPage]); 

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto">
          <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">
            
            {/* 3. Selector de cantidad de registros (Opcional, arriba) */}
            <PaginationControls 
                perPage={perPage} 
                setPerPage={setPerPage} 
                setCurrentPage={setCurrentPage}
                onlySelector={true} 
            />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Pedidos</h1>

            <div className="overflow-x-auto">
              {/* 4. Lista de Pedidos:
                Pasamos 'ordersData.data' porque Laravel Paginator 
                envuelve los registros en esa propiedad.
              */}
              <OrdersList orders={ordersData?.data || []} />
              
              {/* 5. Controles de navegación:
                Usamos la metadata que nos devuelve Laravel (total, last_page, etc.)
              */}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}