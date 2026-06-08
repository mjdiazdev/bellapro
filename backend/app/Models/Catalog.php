<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    protected $fillable = ['name', 'description', 'file_path', 'active', 'order'];

    protected $casts = ['active' => 'boolean'];
}
