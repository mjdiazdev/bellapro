<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'reference',
        'name',
        'description',
        'price_without_tax',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function qrCodes()
    {
        return $this->belongsToMany(QrCode::class, 'product_qr');
    }
}
