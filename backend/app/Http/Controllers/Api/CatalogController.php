<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\CatalogHandler;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function __construct(private CatalogHandler $handler) {}

    /** Listado público — solo catálogos activos */
    public function index()
    {
        return response()->json([
            'catalogs' => $this->handler->listActive(),
        ]);
    }

    /** Listado admin — todos (activos e inactivos) */
    public function all()
    {
        return response()->json([
            'catalogs' => $this->handler->listAll(),
        ]);
    }

    /** Descarga pública del PDF */
    public function download(int $id)
    {
        try {
            $file = $this->handler->download($id);
            return response()->download($file['path'], $file['name'], [
                'Content-Type' => 'application/pdf',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /** Subir nuevo catálogo (admin) */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf|max:20480',
        ]);

        try {
            $catalog = $this->handler->create($request->all(), $request->file('file'));
            return response()->json(['message' => 'Catálogo creado', 'catalog' => $catalog], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Actualizar catálogo (admin) */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        try {
            $catalog = $this->handler->update($id, $request->all(), $request->file('file'));
            return response()->json(['message' => 'Catálogo actualizado', 'catalog' => $catalog]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Eliminar catálogo (admin) */
    public function destroy(int $id)
    {
        try {
            $this->handler->delete($id);
            return response()->json(['message' => 'Catálogo eliminado']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
