<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrCode extends Model
{
    protected $fillable = ['code'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_qr');
    }
}
