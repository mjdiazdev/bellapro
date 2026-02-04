<?php

namespace App\Models;

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
        'category_id', 'name', 'reference', 'price', 'description'
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
     * Accesor inteligente: Busca el archivo físico basado en la referencia.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->reference) {
            return asset('images/placeholder-product.png');
        }

        $extensions = ['jpg', 'jpeg', 'png', 'webp'];

        foreach ($extensions as $ext) {
            $path = "products/{$this->reference}.{$ext}";
            if (Storage::disk('public')->exists($path)) {
                return asset('storage/' . $path);
            }
        }

        return asset('images/placeholder-product.png');
    }
}
