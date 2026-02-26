<?php
namespace App\Handlers;

use App\Repositories\DashboardRepository;

class DashboardHandler
{
    public function __construct(private DashboardRepository $repository) {}

    public function getAdminStats(): array
    {
        $stats = $this->repository->getMonthlyStats();
        $byCenter = $this->repository->getOrdersByDistributionCenter();

        return [
            'cards' => [
                ['title' => 'Pedidos del Mes', 'value' => $stats['total_orders'], 'icon' => 'list'],
                ['title' => 'Pendientes', 'value' => $stats['pending_orders'], 'icon' => 'clock'],
                ['title' => 'Completados', 'value' => $stats['completed_orders'], 'icon' => 'check-circle'],
                ['title' => 'Facturación', 'value' => '€' . number_format($stats['total_revenue'], 2), 'icon' => 'cash'],
                ['title' => 'Nuevos Clientes', 'value' => $stats['new_clients'], 'icon' => 'user-plus'],
            ],
            'charts' => [
                'revenue_by_center' => $byCenter
            ]
        ];
    }
}
