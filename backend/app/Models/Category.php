<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    // Campos permitidos para asignación masiva
    protected $fillable = ['name', 'code', 'qr_url'];

    /**
     * Relación: una categoría tiene muchos productos.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
