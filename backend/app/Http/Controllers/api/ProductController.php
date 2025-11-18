<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getProductsByQr($code)
    {
        // Buscar el QR
        $qr = QrCode::where('code', $code)->first();

        if (!$qr) {
            return response()->json([
                'message' => 'QR no encontrado'
            ], 404);
        }

        // Obtener productos asociados con sus imágenes
        $products = $qr->products()->with('images')->get();

        return response()->json([
            'qr' => $qr->code,
            'products' => $products
        ]);
    }
}
