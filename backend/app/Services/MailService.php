<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\PurchaseMail;

class MailService
{
    public function sendPurchaseMail(string $email, array $orderData): void
    {
        // Preparar payload para la plantilla
        $payload = [
            'order_number' => "0000000-{$orderData['id']}",
            'customer_name' => $orderData['delivery_name'],
            'customer_id' => $orderData['customer_id'],
            'purchase_date' => now()->format('d/m/Y'),
            'items' => array_map(function ($item) {
                return [
                    'name' => $item['product_name'],
                    'qty' => $item['quantity'],
                    'price' => $item['unit_price'],
                ];
            }, $orderData['items']),
            'subtotal' => $orderData['subtotal'],
            'shipping' => $orderData['shipping_price'] . ' (' . $orderData['shipping_method_name'] . ')',
            'total' => $orderData['total']
        ];

        Mail::to($email)->send(new PurchaseMail($payload));
    }
}
