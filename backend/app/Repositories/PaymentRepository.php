<?php

namespace App\Repositories;

use App\Models\Payment;

class PaymentRepository
{
    /**
     * Registrar un pago
     */
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    /**
     * Actualizar el estado de un pago
     */
    public function updateStatus(int $orderId, string $status, array $details = []): void
    {
        Payment::where('order_id', $orderId)->update([
            'status' => $status,
            'details' => $details
        ]);
    }

}
