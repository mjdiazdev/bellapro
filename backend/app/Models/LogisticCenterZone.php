<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticCenterZone extends Model
{
    protected $fillable = [
        'logistic_center_id',
        'postal_code',
        'type'
    ];

    public function center()
    {
        return $this->belongsTo(LogisticCenter::class, 'logistic_center_id');
    }
}
