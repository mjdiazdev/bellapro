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
    public function getAccessToken()
    {
        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->secret)
            ->withOptions([
                'curl' => [
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4, // Forzamos IPv4
                ],
            ])
            ->timeout(30) // Aumentamos a 30 segundos
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials'
            ]);

        if ($response->failed()) {
            throw new \Exception("Error obteniendo token: " . $response->body());
        }

        return $response->json()['access_token'];
    }

    /**
     * Crear orden en PayPal
     */
    public function createOrder(float $amount): array
    {
        $token = $this->getAccessToken();

        $formattedAmount = number_format($amount, 2, '.', '');

        $response = Http::withToken($token)->post(
            $this->baseUrl . '/v2/checkout/orders',
            [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'amount' => [
                            'currency_code' => 'EUR',
                            'value' => $formattedAmount
                        ]
                    ]
                ],
                'application_context' => [
                    'return_url' => env('PAYPAL_RETURN_URL'),
                    'cancel_url' => env('PAYPAL_CANCEL_URL'),
                ]
            ]
        );

        return $response->json();
    }

    /**
     * Capturar pago
     */
    public function captureOrder($paypalOrderId)
    {
        $accessToken = $this->getAccessToken();

        $response = Http::withToken($accessToken)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])
            ->withOptions([
                'curl' => [
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                ],
            ])
            ->timeout(30)
            ->withBody('{}', 'application/json')
            ->post("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture");

        return $response->json();
    }
}
