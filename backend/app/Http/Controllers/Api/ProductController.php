<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\ProductHandler;

class ProductController extends Controller
{
    /**
     * Crear un nuevo producto.
     *
     * @param Request $request
     * @param ProductHandler $handler
     * @return \Illuminate\Http\JsonResponse
     *
     * Este método recibe los datos enviados por el cliente, delega la creación
     * en el handler y devuelve el producto creado o un error si los datos
     * no son válidos o la categoría asociada no existe.
     */
    public function create(Request $request, ProductHandler $handler)
    {
        try {
            $product = $handler->create($request->all());

            return response()->json([
                'message' => 'Producto creado correctamente',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            // El handler lanza una excepción si la categoría no existe
            return response()->json(['message'=>$e->getMessage()], 422);
        }
    }

    /**
     * Mostrar un producto por ID.
     *
     * @param ProductHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * Si el producto no existe, devuelve un error 404.
     */
    public function show(ProductHandler $handler, $id)
    {
        $product = $handler->get($id);

        if (!$product) {
            return response()->json(['message'=>'Producto no encontrado'], 404);
        }

        return response()->json(['data' => $product]);
    }

    /**
     * Actualizar un producto existente.
     *
     * @param Request $request
     * @param ProductHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * Retorna error si el producto no existe o si la categoría enviada no es válida.
     */
    public function update(Request $request, ProductHandler $handler, $id)
    {
        try {
            $product = $handler->update($id, $request->all());

            if (!$product) {
                return response()->json(['message'=>'Producto no encontrado'], 404);
            }

            return response()->json([
                'message' => 'Producto modificado correctamente',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            // Puede ser categoría inexistente o validación del handler
            return response()->json(['message'=>$e->getMessage()], 422);
        }
    }

    /**
     * Actualización masiva de precios y stock.
     *
     * @param Request $request
     * @param ProductHandler $handler
     * @return \Illuminate\Http\JsonResponse
     */
    public function bulkUpdate(Request $request, ProductHandler $handler)
    {
        try {
            // Pasamos el array 'items' que vendrá del frontend al handler
            $result = $handler->bulkUpdate($request->input('items', []));

            return response()->json([
                'message' => 'Productos actualizados masivamente con éxito',
                'count' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Eliminar un producto por ID.
     *
     * @param ProductHandler $handler
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * Retorna 404 si el producto no existe.
     */
    public function destroy(ProductHandler $handler, $id)
    {
        try {
            if (!$handler->delete($id)) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }
            return response()->json(['message' => 'Producto eliminado correctamente']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Listar todos los productos.
     *
     * @param ProductHandler $handler
     * @return \Illuminate\Http\JsonResponse
     */
    public function list(ProductHandler $handler)
    {
        return response()->json([
            'data' => $handler->list()
        ]);
    }

    /**
     * Listar productos filtrados por categoría.
     *
     * @param ProductHandler $handler
     * @param int $categoryId
     * @return \Illuminate\Http\JsonResponse
     */
    public function listByCategory(ProductHandler $handler, $categoryId)
    {
        return response()->json([
            'data' => $handler->listByCategory($categoryId)
        ]);
    }
}
