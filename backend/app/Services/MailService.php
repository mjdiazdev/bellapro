<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\PurchaseMail;

class MailService
{
    public function sendPurchaseMail(string $email, array $orderData): void
    {
        // =======================
        // PREPARAR PAYLOAD PARA BLADE
        // =======================
        $payload = [
            // Número de pedido formateado
            'order_number' => "0000000-{$orderData['order_number']}",

            // Datos del cliente
            'customer_name' => $orderData['customer_name'],
            'customer_id' => $orderData['customer_id'],
            'purchase_date' => $orderData['purchase_date'],

            // Items (formato que el Blade espera)
            'items' => array_map(function ($item) {
                return [
                    'name' => $item['product_name'],
                    'qty' => $item['quantity'],
                    'price' => $item['unit_price'],
                ];
            }, $orderData['items']),

            // Totales
            'subtotal' => $orderData['subtotal'],

            // Envío (estructura nueva)
            'shipping' => [
                'method_name' => $orderData['shipping']['method_name'],
                'price' => $orderData['shipping']['price'],
            ],

            // IVA
            'iva_amount' => $orderData['iva_amount'],

            // Total final con IVA
            'total_with_iva' => $orderData['total_with_iva'],
        ];

        Mail::to($email)->send(new PurchaseMail($payload));
    }
}
