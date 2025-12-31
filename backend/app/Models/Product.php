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
        'category_id', 'name', 'reference', 'price', 'description', 'photo_url'
    ];

    protected $appends = ['full_photo_url'];

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

    public function getFullPhotoUrlAttribute()
    {
        if ($this->photo_url) {
            // Genera: http://tu-dominio/storage/products/archivo.jpg
            return asset('storage/' . $this->photo_url);
        }

        // Imagen por defecto si no hay una subida
        return asset('images/placeholder-product.png');
    }
}
