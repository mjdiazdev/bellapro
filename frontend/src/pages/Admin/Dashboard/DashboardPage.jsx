import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import { getAbsolute } from "../../../services/apiService";

// Iconos y Gráficos
import { Users, ShoppingBag, Clock, CheckCircle, Euro, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

/**
 * Componentes de Carga (Skeletons) para mejorar la UX (Velocidad percibida)
 */
const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse h-32 w-full rounded-2xl shadow-sm border border-gray-100"></div>
);

const SkeletonChart = () => (
  <div className="bg-gray-200 animate-pulse h-96 w-full rounded-2xl shadow-sm border border-gray-100"></div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Paleta de colores corporativa para los gráficos
  const COLORS = ['#FF69B4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  /**
   * Carga los datos desde el endpoint del backend.
   * La lógica está unificada en un solo efecto de montaje.
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getAbsolute("/dashboard/stats");
      setStats(res);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Contenido Principal */}
        <main className="flex-1 md:ml-64 bg-gray-50 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Contenido Superior (La tarjeta con la tabla) */}
          <div className="flex-grow p-4 md:p-6">
            <div className="container mx-auto">
              
              {/* Título de la página */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Panel de Control</h1>
                <p className="text-gray-500">Métricas clave de rendimiento y análisis por delegación.</p>
              </header>

              {/* SECCIÓN 1: Tarjetas de Resumen (KPIs) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {loading 
                  ? [1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)
                  : stats?.cards?.map((card, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-pink-50 rounded-xl text-pink-500">
                            {card.title.includes("Facturación") ? <Euro size={22} /> : 
                            card.title.includes("Nuevos") ? <Users size={22} /> :
                            card.title.includes("Pendientes") ? <Clock size={22} /> :
                            card.title.includes("Completados") ? <CheckCircle size={22} /> :
                            <ShoppingBag size={22} />}
                          </div>
                        </div>
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                      </div>
                    ))
                }
              </div>

              {/* SECCIÓN 2: Análisis Detallado */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Gráfico de Barras - Facturación */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="text-pink-500" size={20} /> Ventas por Delegación
                    </h2>
                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border">Mes Actual</span>
                  </div>
                  
                  <div className="h-80 w-full">
                    {loading ? <SkeletonChart /> : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.charts?.revenue_by_center}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                          <Tooltip 
                            cursor={{fill: '#f9fafb'}} 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                          />
                          <Bar dataKey="total_amount" radius={[6, 6, 0, 0]} barSize={45}>
                            {stats?.charts?.revenue_by_center?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Ranking Lateral */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Eficiencia por Centro</h2>
                  {loading ? <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div> : (
                    <div className="space-y-6">
                      {stats?.charts?.revenue_by_center
                        ?.sort((a, b) => b.total_amount - a.total_amount)
                        .map((center, index) => (
                        <div key={index} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index === 0 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {index + 1}
                            </span>
                            <p className="text-sm font-medium text-gray-600 group-hover:text-pink-500 transition-colors">{center.name}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">€{Number(center.total_amount).toLocaleString('es-ES')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}