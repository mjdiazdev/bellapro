<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\CategoryHandler;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Crear una nueva categoría.
     *
     * @param Request $request
     * @param CategoryHandler $handler
     * @return \Illuminate\Http\JsonResponse
     *
     * Retorna error si los datos son inválidos o el código ya existe.
     */
    public function create(Request $request, CategoryHandler $handler)
    {
        try {
            $category = $handler->create($request->all());

            return response()->json([
                'message' => 'Categoría creada correctamente',
                'data' => $category
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Mostrar una categoría por ID.
     *
     * @param CategoryHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * Retorna 404 si la categoría no existe.
     */
    public function show(CategoryHandler $handler, $id)
    {
        $category = $handler->get($id);

        if (!$category) {
            return response()->json(['message' => 'Categoria no existe'], 404);
        }

        return response()->json($category);
    }

    /**
     * Buscar una categoría por su código.
     *
     * @param CategoryHandler $handler
     * @param string $code
     * @return \Illuminate\Http\JsonResponse
     */
    public function showByCode(CategoryHandler $handler, $code)
    {
        $categoryData = $handler->getByCode($code);

        if (!$categoryData) {
            return response()->json(['message' => 'Categoria no encontrada'], 404);
        }

        return response()->json(['data' => $categoryData]);
    }

    /**
     * Actualizar una categoría.
     *
     * @param Request $request
     * @param CategoryHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, CategoryHandler $handler, $id)
    {
        try {
            $category = $handler->update($id, $request->all());

            if (!$category) {
                return response()->json(['message'=>'Categoria no existe'], 404);
            }

            return response()->json([
                'message' => 'Categoría modificada correctamente',
                'data' => $category
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Eliminar una categoría por ID.
     *
     * @param CategoryHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * Retorna 404 si no existe.
     * Si ocurre un error inesperado, retorna 500.
     */
    public function destroy(CategoryHandler $handler, $id)
    {
        try {
            if (!$handler->delete($id)) {
                return response()->json(['message'=>'Categoria no existe'], 404);
            }

            return response()->json(['message'=>'Categoria eliminada correctamente']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar todas las categorías.
     *
     * @param CategoryHandler $handler
     * @return \Illuminate\Http\JsonResponse
     */
    public function list(CategoryHandler $handler)
    {
        return response()->json([
            'data' => $handler->list()
        ]);
    }

    /**
     * Descargar un PDF con todos los códigos QR de categorías.
     *
     * @return mixed
     */
    public function downloadAllQRCodes()
    {
        $categories = Category::all();

        // Agregar URL completa al QR generado
        foreach ($categories as $cat) {
            if ($cat->qr_url) {
                $cat->qr_full = asset('storage/' . $cat->qr_url);
            }
        }

        // Generar PDF usando la vista pdf.qrs_categories
        $pdf = Pdf::loadView('pdf.qrs_categories', [
            'categories' => $categories
        ]);

        return $pdf->stream('qrs-categorias.pdf');
    }
}
