<?php
namespace App\Handlers;

use App\Repositories\CategoryRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class CategoryHandler
{
    public function __construct(private CategoryRepository $categories) {}

    /**
     * Crear una categoría y generar su QR.
     */
    public function create(array $data)
    {
        // Validaciones internas del Handler
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255|unique:categories,name',
            'code' => 'required|string|max:50|unique:categories,code'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        // Crear categoría en BD
        $category = $this->categories->create($data);

        return $this->buildQr($category);
    }

    /**
     * Regenerar el QR de una categoría existente por ID.
     */
    public function regenerateQr(int $id)
    {
        $category = $this->categories->findById($id);

        if (!$category) {
            throw new \Exception("Categoría no encontrada.");
        }

        return $this->buildQr($category);
    }

    /**
     * Regenerar el QR de una categoría existente por código.
     */
    public function regenerateQrByCode(string $code)
    {
        $category = $this->categories->findByCode($code);

        if (!$category) {
            throw new \Exception("Categoría no encontrada con código: {$code}");
        }

        return $this->buildQr($category);
    }

    private function buildQr($category)
    {
        // Preparar renderer para SVG (QR code)
        $renderer = new ImageRenderer(
            new RendererStyle(300),
            new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
        );
        $writer = new Writer($renderer);

        $frontendUrl = config('app.frontend_url');
        $qrContent = $frontendUrl . '/store?qr=' . $category->code;

        // Generar SVG del QR
        $qrImage = $writer->writeString($qrContent);

        // Ruta donde se almacenará el archivo
        $qrPath = 'qrs/' . $category->code . '.svg';

        // Guardar QR en storage/public
        Storage::disk('public')->put($qrPath, $qrImage);

        // Actualizar categoría con la ruta del QR
        $this->categories->updateQr($category->id, $qrPath);
        $category->qr_url = asset('storage/' . $qrPath);

        return $category;
    }


    /**
     * Obtener una categoría por ID.
     */
    public function get(int $id)
    {
        return $this->categories->findById($id);
    }

    /**
     * Actualizar una categoría.
     */
    public function update(int $id, array $data)
    {
        // Validaciones internas (opcionales)
        $validator = Validator::make($data, [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $id,
            'code' => 'sometimes|string|max:50|unique:categories,code,' . $id
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return $this->categories->update($id, $data);
    }

    /**
     * Eliminar categoría.
     */
    public function delete(int $id): bool
    {
        $category = $this->categories->findById($id);

        if (!$category) {
            return false;
        }

        // REGLA DE NEGOCIO: ¿Tiene productos?
        if ($category->products()->exists()) {
            throw new \Exception("Esta categoría tiene productos asignados y no puede ser eliminada.");
        }

        return $this->categories->delete($id);
    }

    /**
     * Listado de todas las categorías.
     */
    public function list(): array
    {
        return $this->categories->all();
    }

    /**
     * Obtener categoría + productos usando un código.
     */
    public function getByCode(string $code)
    {
        return $this->categories->getProductsByCode($code);
    }
}
