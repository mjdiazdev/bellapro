<?php

namespace App\Models;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * Modelo Product: representa un producto dentro de una categoría.
 */
class Product extends Model
{
    // Campos permitidos para asignación masiva
    protected $fillable = [
        'category_id', 'name', 'reference', 'price', 'description','image'
    ];

    protected $appends = ['image_url'];

    /**
     * Relación: un producto pertenece a una categoría.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function stock()
    {
        // Un producto tiene un registro de stock único
        return $this->hasOne(ProductStock::class);
    }

    public function orderItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        // Relacionamos con OrderItem para verificar si existen ventas de este producto
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Accesor inteligente: Busca el archivo físico basado en el nombre del producto.
     */
    public function getImageUrlAttribute() {
        // Si hay un nombre guardado en la BD y el archivo existe
        if ($this->image && Storage::disk('public')->exists("products/{$this->image}")) {
            return asset('storage/products/' . $this->image);
        }

        // Fallback: Si no tiene imagen o no existe el archivo físico
        return asset('images/placeholder-product.png');
    }
}
