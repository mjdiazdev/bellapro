<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo ProductStock: representa el stock de un producto.
 */
class ProductStock extends Model
{
    protected $table = 'product_stocks';

    // Campos permitidos para asignación masiva
    protected $fillable = [
        'product_id', 'stock', 'min_stock'
    ];

    /**
     * Relación: un registro de stock pertenece a un producto.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
