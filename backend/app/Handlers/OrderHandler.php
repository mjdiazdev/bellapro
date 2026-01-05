<?php

namespace App\Handlers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Services\PayPalService;
use App\Services\MailService;

use App\Repositories\OrderRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\PostalCodeRepository;
use App\Repositories\ShippingMethodRepository;


/**
 * Handler para la creación de órdenes de venta
 */
class OrderHandler
{
    public function __construct(
        private OrderRepository $orders,
        private OrderItemRepository $orderItems,
        private PaymentRepository $payments,
        private ProductRepository $products,
        private CustomerRepository $customers,
        private PostalCodeRepository $postalCodes,
        private ShippingMethodRepository $shippingMethods
    ) {}

    /**
     * Crear una orden completa (transacción)
     */
    public function create(array $data)
    {
        // =======================
        // VALIDACIÓN GLOBAL
        // =======================
        $validator = Validator::make($data, [
            'customer' => 'required|array',
            'customer.email' => 'required|email',
            'delivery' => 'required|array',
            'delivery.postal_code' => 'required|string',
            'shipping_method_id' => 'required|integer',
            'items' => 'required|array|min:1',
            'payment' => 'required|array',
            'payment.method' => 'required|string',
            'payment.amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // ==========================================================
        // PRE-VALIDACIÓN DE STOCK (Antes de iniciar transacción)
        // ==========================================================
        foreach ($data['items'] as $item) {
            $product = $this->products->findById($item['product_id']);
            if (!$product || ($item['quantity'] > ($product->stock->stock ?? 0))) {
                throw new \Exception("Stock insuficiente para el producto: " . ($product->name ?? 'ID '.$item['product_id']));
            }
        }

        DB::beginTransaction();

        try {
            // =======================
            // CUSTOMER (crear o actualizar)
            // =======================

            // 1. Extraer datos del cliente
            $customerData = $data['customer'];

            // 2. Validar campos mínimos obligatorios
            $validator = Validator::make($customerData, [
                'nif' => 'required|string',
                'email' => 'required|email',
                'name' => 'required|string',
                'postal_code' => 'required|string',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            // 3. Obtener ID del código postal desde el código
            $postalCode = $this->postalCodes->findByCode($customerData['postal_code']);
            if (!$postalCode) {
                throw new \Exception('Código postal del cliente no válido');
            }

            // 4. Sustituir postal_code por postal_code_id
            $customerData['postal_code_id'] = $postalCode->id;
            unset($customerData['postal_code']);

            // 5. Buscar cliente por email
            $customer = $this->customers->findByEmail($customerData['email']);

            // 6. Crear o actualizar cliente
            if ($customer) {
                $customer->update($customerData); //Si existe, actualiza
            } else {
                $customer = $this->customers->create($customerData); //Si no existe, crea uno nuevo
            }

            // =======================
            // MÉTODO DE ENVÍO
            // =======================
            $shippingMethod = $this->shippingMethods->findById($data['shipping_method_id']); //Obtener método de envío
            if (!$shippingMethod) {
                throw new \Exception('Método de envío no válido');
            }
            // =======================
            // DIRECCIÓN DE ENVÍO
            // =======================
            $deliveryPostal = $this->postalCodes->findByCode($data['delivery']['postal_code']);
            if (!$deliveryPostal) {
                throw new \Exception('Código postal de entrega no válido');
            }

            // =======================
            // CALCULAR TOTALES
            // =======================
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);
                // 1. Acumular subtotal
                $subtotal += $product->price * $item['quantity'];

                // 2. DESCONTAR STOCK REAL
                // Accedemos a la relación y restamos la cantidad
                $nuevoStock = $product->stock->stock - $item['quantity'];
                $product->stock()->update(['stock' => $nuevoStock]);
            }

            // --- LÓGICA DE IVA 21% ---
            $shippingPrice = $shippingMethod->price;
            $ivaPorcentaje = 0.21;

            // Calculamos el IVA sobre (Subtotal + Envío)
            $taxAmount = ($subtotal + $shippingPrice) * $ivaPorcentaje;

            // El total final que guardamos y cobramos
            $totalFinal = $subtotal + $shippingPrice + $taxAmount;

            // =======================
            // CREAR ORDEN
            // =======================
            $order = $this->orders->create([
                'customer_id' => $customer->id,
                'delivery_email' => $customerData['email'],
                'delivery_name' => $data['delivery']['name'],
                'delivery_nif' => $data['delivery']['nif'],
                'delivery_phone' => $data['delivery']['phone'],
                'delivery_address' => $data['delivery']['address'],
                'delivery_postal_code_id' => $deliveryPostal->id,
                'shipping_method_id' => $shippingMethod->id,
                'subtotal' => $subtotal,
                'shipping_price' => $shippingPrice,
                'total' => $totalFinal, // Total con IVA incluido
                'status' => 'pending'
            ]);

            // 6. CREAR ITEMS Y PAGO PENDIENTE
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);
                $this->orderItems->create([
                    'order_id'    => $order->id,
                    'product_id'  => $product->id,
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $product->price,
                    'total_price' => $product->price * $item['quantity']
                ]);
            }

            $this->payments->create([
                'order_id' => $order->id,
                'method'   => $data['payment']['method'],
                'amount'   => $totalFinal, // Cobramos el total con IVA
                'status'   => 'pending'
            ]);

            DB::commit();

            // 7. LÓGICA DE PAYPAL
            if ($data['payment']['method'] === 'paypal') {
                $paypalService = new PayPalService();
                // Enviamos el totalFinal (con IVA) a PayPal
                $paypalOrder = $paypalService->createOrder($totalFinal);

                $this->payments->updateStatus($order->id, 'pending', ['paypal_order_id' => $paypalOrder['id']]);

                return [
                    'order_id' => $order->id,
                    'paypal' => [
                        'id' => $paypalOrder['id'],
                        'approve_url' => collect($paypalOrder['links'])->firstWhere('rel', 'approve')['href']
                    ]
                ];
            }

            return ['order' => $order];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Capturar pago de PayPal
     */
    public function capturePaypalPayment(int $orderId, string $paypalOrderId)
    {
        Log::info("Iniciando captura PayPal. Order: $orderId, Token: $paypalOrderId");
        $order = $this->orders->findById($orderId);
        if (!$order) throw new \Exception('Orden no encontrada');

        $paypal = new PayPalService();
        $capture = $paypal->captureOrder($paypalOrderId);

        if (($capture['status'] ?? '') !== 'COMPLETED') {
            throw new \Exception('PayPal devolvió estado: ' . ($capture['status'] ?? 'NULL') . '. Respuesta completa: ' . json_encode($capture));
        }

        // 1. Actualizar estados
        $this->payments->updateStatus($orderId, 'completed', $capture);
        $order->update(['status' => 'completed']);

        // 2. Enviar correo
        try {
            $mailService = new MailService();
            $mailData = $this->prepareOrderMailData($order);
            $mailService->sendPurchaseMail($order->delivery_email, $mailData);
        } catch (\Exception $e) {
            // Loguear error de mail pero no cancelar la transacción del pago ya capturado
            Log::error("Error enviando correo de orden {$orderId}: " . $e->getMessage());
        }

        return $order;
    }

     /**
     * Listar todas las órdenes
     */
    public function list()
    {
        return $this->orders->all();
    }

    /**
     * Obtener detalle de una orden
     */
    public function get(int $id)
    {
        return $this->orders->findById($id);
    }

    /**
     * Prepara los datos formateados para el servicio de correo
     */
    private function prepareOrderMailData($order): array
    {
        // 1. Obtener los items con sus nombres de producto
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'product_name' => $item->product->name,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->unit_price,
                'total_price'  => $item->total_price
            ];
        }

        // 2. Cálculos de Desglose de IVA
        // Recordatorio: $order->total ya es el monto FINAL (Subtotal + Envío + IVA)
        $totalFinal = (float) $order->total;
        $ivaPorcentaje = 21;

        /**
         * Operación Inversa para desglosar:
         * Base Imponible = Total / 1.21
         * IVA = Total - Base Imponible
         */
        $totalSinIva = $totalFinal / 1.21;
        $ivaAmount   = $totalFinal - $totalSinIva;

        return [
            'order_number'      => $order->id,
            'customer_id'       => $order->customer_id,
            'customer_name'     => $order->delivery_name,
            'purchase_date'     => $order->created_at->format('d/m/Y'),
            'delivery_email'    => $order->delivery_email,
            'subtotal_products' => $order->subtotal, // Neto de productos
            'shipping' => [
                'method_name'   => $order->shippingMethod->name,
                'price'         => $order->shipping_price // Neto de envío
            ],
            'iva_percentage'    => $ivaPorcentaje,
            'iva_amount'        => number_format($ivaAmount, 2, '.', ''),
            'total_without_iva' => number_format($totalSinIva, 2, '.', ''),
            'total_with_iva'    => number_format($totalFinal, 2, '.', ''),
            'items'             => $items
        ];
    }
}
