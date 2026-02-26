<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardRepository
{
    public function getMonthlyStats()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Creamos una consulta base para el mes actual para no repetir código
        $baseQuery = Order::whereBetween('created_at', [$startOfMonth, $endOfMonth]);

        return [
            // Pedidos Totales
            'total_orders' => (clone $baseQuery)->count(),

            // Pedidos Pendientes (Contamos filas)
            'pending_orders' => (clone $baseQuery)->where('status', 'pending')->count(),

            // Pedidos Completados (Contamos filas)
            'completed_orders' => (clone $baseQuery)->where('status', 'completed')->count(),

            // Facturación Mensual (Suma de montos de completados)
            'total_revenue' => (clone $baseQuery)->where('status', 'completed')->sum('total'),

            // Nuevos Clientes en el mes
            'new_clients' => Customer::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
        ];
    }

    public function getOrdersByDistributionCenter()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Ajustado: Suma de 'total' por delegación o centro de distribución, filtrando por 'completed' y el mes actual
        return DB::table('orders')
            ->join('dist_center_shipping_method', 'orders.dist_center_shipping_method_id', '=', 'dist_center_shipping_method.id')
            ->join('distribution_centers', 'dist_center_shipping_method.distribution_center_id', '=', 'distribution_centers.id')
            ->select(
                'distribution_centers.name',
                DB::raw('SUM(orders.total) as total_amount')
            )
            ->where('orders.status', 'completed') // Solo completados
            ->whereBetween('orders.created_at', [$startOfMonth, $endOfMonth]) //Filtramos por el presente mes
            ->groupBy('distribution_centers.name')
            ->get();
    }
}
