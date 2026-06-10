<?php

namespace App\Handlers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Services\PayPalService;
use App\Services\RedsysService;
use App\Handlers\CouponHandler;
use App\Services\MailService;
use App\Handlers\PostalCodeHandler;
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
            'dist_center_shipping_method_id' => 'required|integer|exists:dist_center_shipping_method,id',
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
                throw new \Exception("Stock insuficiente para el producto: " . ($product->name));
            }
        }

        DB::beginTransaction();

        try {
            // =======================
            // CUSTOMER (crear o actualizar)
            // =======================
            $customerData = $data['customer'];

            $validator = Validator::make($customerData, [
                'nif' => 'required|string',
                'email' => 'required|email',
                'name' => 'required|string',
                'postal_code' => 'required|string',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

           // Pon:
        $postalCodeHandler = app(\App\Handlers\PostalCodeHandler::class);
        $postalCode = $postalCodeHandler->lookupOrCreate($customerData['postal_code']);
            if (!$postalCode) {
                throw new \Exception('Código postal del cliente no válido');
            }

            $customerData['postal_code_id'] = $postalCode->id;
            unset($customerData['postal_code']);

            $customer = $this->customers->findByEmail($customerData['email']);

            if ($customer) {
                $customer->update($customerData);
            } else {
                $customer = $this->customers->create($customerData);
            }

            // =======================
            // RELACIÓN MÉTODO DE ENVÍO Y CENTRO
            // =======================
            // Obtenemos la información del método de envío (precio) desde la tabla pivote
            $shippingRelation = DB::table('dist_center_shipping_method as dcsm')
                ->join('shipping_methods as sm', 'dcsm.shipping_method_id', '=', 'sm.id')
                ->where('dcsm.id', $data['dist_center_shipping_method_id'])
                ->select('sm.price', 'sm.name')
                ->first();

            if (!$shippingRelation) {
                throw new \Exception('La opción de envío seleccionada no es válida o ya no existe.');
            }

            // =======================
            // DIRECCIÓN DE ENVÍO
            // =======================
            $deliveryPostal = $postalCodeHandler->lookupOrCreate($data['delivery']['postal_code']);

            if (!$deliveryPostal) {
                throw new \Exception('Código postal de entrega no válido');
            }

            // =======================
            // CALCULAR TOTALES
            // =======================
            $subtotal  = 0;
            $cartItems = [];
            foreach ($data['items'] as $item) {
                $product    = $this->products->findById($item['product_id']);
                $unitPrice  = (float) $product->price;
                $subtotal  += $unitPrice * $item['quantity'];
                $cartItems[] = [
                    'product_id' => (int) $product->id,
                    'quantity'   => (int) $item['quantity'],
                    'unit_price' => $unitPrice,
                ];

                $nuevoStock = $product->stock->stock - $item['quantity'];
                $product->stock()->update(['stock' => $nuevoStock]);
            }

            // =======================
            // CUPÓN (opcional)
            // =======================
            $discountAmount = 0;
            $appliedCoupon  = null;
            if (!empty($data['coupon_code'])) {
                $couponHandler  = app(CouponHandler::class);
                $appliedCoupon  = $couponHandler->validateCoupon($data['coupon_code'], $subtotal);
                $discountAmount = $couponHandler->calculateDiscount($appliedCoupon, $cartItems, $subtotal);
            }

            // --- LÓGICA DE IVA 21% ---
            $shippingPrice     = $shippingRelation->price;
            $ivaPorcentaje     = 0.21;
            $baseAfterDiscount = $subtotal + $shippingPrice - $discountAmount;
            $taxAmount         = $baseAfterDiscount * $ivaPorcentaje;
            $totalFinal        = $baseAfterDiscount + $taxAmount;

            // =======================
            // CREAR ORDEN
            // =======================
            $order = $this->orders->create([
                'customer_id'                    => $customer->id,
                'delivery_email'                 => $customerData['email'],
                'delivery_name'                  => $data['delivery']['name'],
                'delivery_nif'                   => $data['delivery']['nif'] ?? null,
                'delivery_phone'                 => $data['delivery']['phone'] ?? null,
                'delivery_address'               => $data['delivery']['address'],
                'delivery_postal_code_id'        => $deliveryPostal->id,
                'dist_center_shipping_method_id' => $data['dist_center_shipping_method_id'],
                'subtotal'                       => $subtotal,
                'shipping_price'                 => $shippingPrice,
                'total'                          => $totalFinal,
                'status'                         => 'pending',
                'coupon_id'                      => $appliedCoupon?->id,
                'discount_amount'                => $discountAmount > 0 ? $discountAmount : null,
            ]);

            // =======================
            // CREAR ITEMS Y PAGO
            // =======================
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
                'amount'   => $totalFinal,
                'status'   => 'pending'
            ]);

            // =======================
            // LÓGICA DE PAYPAL
            // =======================
            if ($appliedCoupon) {
                app(CouponHandler::class)->incrementUsage($appliedCoupon);
            }

            $totalParaPaypal = number_format($totalFinal, 2, '.', '');
            if ($data['payment']['method'] === 'paypal') {
                $paypalService = new PayPalService();
                $paypalOrder = $paypalService->createOrder($totalParaPaypal);

                if (!isset($paypalOrder['id'])) {
                    Log::error("Error de PayPal: ", (array)$paypalOrder);
                    throw new \Exception('No se pudo conectar con PayPal. Por favor, intenta más tarde.');
                }

                $this->payments->updateStatus($order->id, 'pending', ['paypal_order_id' => $paypalOrder['id']]);

                DB::commit();

                $approveLink = collect($paypalOrder['links'])->firstWhere('rel', 'approve');

                return [
                    'order_id' => $order->id,
                    'paypal' => [
                        'id' => $paypalOrder['id'],
                        'approve_url' => $approveLink ? $approveLink['href'] : null
                    ]
                ];
            }

            // =======================
            // LÓGICA DE REDSYS (TPV)
            // =======================
            if ($data['payment']['method'] === 'redsys') {
                $redsysService = new RedsysService();

                $frontendUrl  = env('FRONTEND_URL', 'http://localhost:3000');
                $orderNumber  = sprintf('%012d', $order->id);
                $amountCents  = (int) round($totalFinal * 100);

                $redsysParams = $redsysService->initiatePayment([
                    'order_number' => $orderNumber,
                    'amount_cents' => $amountCents,
                    'url_ok'       => $frontendUrl . '/pago/redsys-ok',
                    'url_ko'       => $frontendUrl . '/pago/redsys-error',
                ]);

                DB::commit();

                return [
                    'order_id' => $order->id,
                    'redsys'   => $redsysParams,
                ];
            }

            DB::commit();

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
    public function list($perPage = 25, $user = null)
    {
        // Si por alguna razón no llega el usuario, el repositorio manejará la lógica por defecto
        return $this->orders->all($perPage, $user);
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
    public function prepareOrderMailData($order): array
    {
        $order->load(['items.product', 'distributionCenterMethod.shippingMethod']);

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
        // $order->total ya es el monto FINAL (Subtotal + Envío + IVA)
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
            'subtotal_products' => $order->subtotal,
            'discount_amount'   => $order->discount_amount ? number_format((float) $order->discount_amount, 2, '.', '') : null,
            'shipping' => [
                'method_name'   => $order->distributionCenterMethod->shippingMethod->name ?? 'Envío Estándar',
                'price'         => $order->shipping_price,
            ],
            'iva_percentage'    => $ivaPorcentaje,
            'iva_amount'        => number_format($ivaAmount, 2, '.', ''),
            'total_without_iva' => number_format($totalSinIva, 2, '.', ''),
            'total_with_iva'    => number_format($totalFinal, 2, '.', ''),
            'items'             => $items,
        ];
    }

    public function changeStatusBulk(array $data)
    {
        $validator = Validator::make($data, [
            'ids'    => 'required|array',
            'ids.*'  => 'exists:orders,id',
            'status' => 'required|in:pending,completed,canceled' // <--- Validación estricta
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return $this->orders->updateStatusBulk($data['ids'], $data['status']);
    }
}
