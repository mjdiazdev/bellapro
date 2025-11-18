<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\Product;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    // Listar todos los QRs
    public function index()
    {
        $qrs = QrCode::with('products')->get();
        return response()->json($qrs);
    }

    // Crear un nuevo QR
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:qr_codes,code',
        ]);

        $qr = QrCode::create([
            'code' => $request->code
        ]);

        return response()->json($qr, 201);
    }

    // Mostrar un QR específico con productos
    public function show(QrCode $qr)
    {
        $qr->load('products.images');
        return response()->json($qr);
    }

    // Actualizar un QR
    public function update(Request $request, QrCode $qr)
    {
        $request->validate([
            'code' => 'required|unique:qr_codes,code,' . $qr->id,
        ]);

        $qr->update([
            'code' => $request->code
        ]);

        return response()->json($qr);
    }

    // Eliminar un QR
    public function destroy(QrCode $qr)
    {
        $qr->delete();
        return response()->json(['message' => 'QR eliminado']);
    }

    // Asignar productos a un QR
    public function assignProducts(Request $request, QrCode $qr)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        // Sincroniza los productos: agrega y elimina los que no estén en el array
        $qr->products()->sync($request->product_ids);

        $qr->load('products.images');

        return response()->json([
            'message' => 'Productos asignados al QR correctamente',
            'qr' => $qr
        ]);
    }
}
