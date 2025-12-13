<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Servicio para integración con PayPal
 */
class PayPalService
{
    private string $baseUrl;
    private string $clientId;
    private string $secret;

    public function __construct()
    {
        $this->baseUrl = config('services.paypal.mode') === 'sandbox'
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';

        $this->clientId = config('services.paypal.client_id');
        $this->secret = config('services.paypal.secret');
    }

    /**
     * Obtener token OAuth
     */
    private function getAccessToken(): string
    {
        $response = Http::withBasicAuth($this->clientId, $this->secret)
            ->asForm()
            ->post($this->baseUrl . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        return $response->json()['access_token'];
    }

    /**
     * Crear orden en PayPal
     */
    public function createOrder(float $amount): array
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)->post(
            $this->baseUrl . '/v2/checkout/orders',
            [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'amount' => [
                            'currency_code' => 'EUR',
                            'value' => number_format($amount, 2, '.', '')
                        ]
                    ]
                ]
            ]
        );

        return $response->json();
    }

    /**
     * Capturar pago
     */
    public function captureOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post($this->baseUrl . "/v2/checkout/orders/{$paypalOrderId}/capture");

        return $response->json();
    }
}
