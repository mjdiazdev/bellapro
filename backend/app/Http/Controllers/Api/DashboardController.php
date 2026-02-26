<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\DashboardHandler;

class DashboardController extends Controller
{
    public function __construct(private DashboardHandler $handler) {}

    public function index()
    {
        try {
            $data = $this->handler->getAdminStats();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudieron cargar las estadísticas'], 500);
        }
    }
}
