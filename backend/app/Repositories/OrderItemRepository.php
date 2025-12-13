<?php

namespace App\Repositories;

use App\Models\OrderItem;

class OrderItemRepository
{
    /**
     * Crear item de orden
     */
    public function create(array $data): OrderItem
    {
        return OrderItem::create($data);
    }
}
