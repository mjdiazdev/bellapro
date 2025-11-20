<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\Product;
use App\Models\ProductImage;
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
    // Listar todos los productos con imágenes
    public function index()
    {
        $products = Product::with('images')->get();
        return response()->json($products);
    }

    // Crear producto
    public function store(Request $request)
    {
        $request->validate([
            'reference' => 'required|unique:products,reference',
            'name' => 'required',
            'description' => 'nullable',
            'price_without_tax' => 'required|numeric',
        ]);

        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

    // Mostrar producto por ID
    public function show(Product $product)
    {
        $product->load('images');
        return response()->json($product);
    }

    // Actualizar producto
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'reference' => 'required|unique:products,reference,' . $product->id,
            'name' => 'required',
            'description' => 'nullable',
            'price_without_tax' => 'required|numeric',
        ]);

        $product->update($request->all());

        return response()->json($product);
    }

    // Eliminar producto
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

    // Agregar imagen a un producto
    public function addImage(Request $request, Product $product)
    {
        $request->validate([
            'url' => 'required|string'
        ]);

        $image = $product->images()->create([
            'url' => $request->url
        ]);

        return response()->json($image, 201);
    }

    // Eliminar imagen de un producto
    public function deleteImage(Product $product, ProductImage $image)
    {
        // Validación de pertenencia
        if ($image->product_id !== $product->id) {
            return response()->json(['error' => 'La imagen no pertenece a este producto'], 400);
        }

        $image->delete();
        return response()->json(['message' => 'Imagen eliminada']);
    }
}
