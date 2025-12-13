<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Product: representa un producto dentro de una categoría.
 */
class Product extends Model
{
    // Campos permitidos para asignación masiva
    protected $fillable = [
        'category_id', 'name', 'reference', 'price', 'description', 'photo_url'
    ];

    /**
     * Relación: un producto pertenece a una categoría.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
