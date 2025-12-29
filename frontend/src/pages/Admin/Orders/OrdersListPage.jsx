import { useEffect, useState } from "react";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";

import OrdersList from "../../../components/Admin/Orders/OrdersList";
import { getAll } from "../../../services/apiService";

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getAll("orders"); // devuelve { data: [...] }
            setOrders(res.data || []);          // aquí sí accedes al array
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:ml-64 bg-gray-50 overflow-y-auto">
          <div className="container mx-auto card p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pedidos</h1>

            {/* Tabla con scroll horizontal en móviles */}
            <div className="overflow-x-auto">
              {loading ? (
                <p>Cargando pedidos...</p>
              ) : (
                <OrdersList orders={orders} />
            )}
            </div>            
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
