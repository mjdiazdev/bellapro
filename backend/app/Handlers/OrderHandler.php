<?php

namespace App\Handlers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
        $errorsStock = [];
        foreach ($data['items'] as $item) {
            $product = $this->products->findById($item['product_id']);
            if (!$product) {
                throw new \Exception("Producto con ID {$item['product_id']} no encontrado.");
            }

            $stockDisponible = $product->stock ? $product->stock->stock : 0;

            if ($item['quantity'] > $stockDisponible) {
                $errorsStock[] = "El producto '{$product->name}' solo tiene {$stockDisponible} unidades disponibles (solicitaste {$item['quantity']}).";
            }
        }

        if (!empty($errorsStock)) {
            // Lanzamos excepción con los detalles de falta de stock
            throw new \Exception(implode(" | ", $errorsStock));
        }

        // Crear transacción de la base de datos para manejar los errores
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

            $shippingPrice = $shippingMethod->price;
            $total = $subtotal + $shippingPrice;

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
                'delivery_address_extra' => $data['delivery']['address_extra'] ?? null,
                'delivery_postal_code_id' => $deliveryPostal->id,

                'shipping_method_id' => $shippingMethod->id,

                'subtotal' => $subtotal,
                'shipping_price' => $shippingPrice,
                'total' => $total,
                'status' => 'pending'
            ]);

            // =======================
            // ITEMS DE LA ORDEN
            // =======================
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);

                $this->orderItems->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $product->price * $item['quantity']
                ]);
            }


            // =======================
            // REGISTRAR PAGO
            // =======================
            $this->payments->create([
                'order_id' => $order->id,
                'method' => $data['payment']['method'],
                'details' => $data['payment']['details'] ?? [],
                'amount' => $data['payment']['amount'],
                'status' => 'pending'
            ]);


            // Crear transacción de la base de datos
            DB::commit();

            // =======================
            // EN CASO DE PAYPAL
            // =======================
            if ($data['payment']['method'] === 'paypal') {
                $paypalService = new PayPalService();
                $paypalOrder = $paypalService->createOrder($total);
                $this->payments->updateStatus(
                    $order->id,
                    'pending',
                    ['paypal_order_id' => $paypalOrder['id']]
                );
            }

            // =======================
            // ENVIAR CORREO AL CLIENTE
            // =======================
            $mailService = new MailService();

            // Preparamos items de la orden para el correo
            $orderItemsData = [];
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);
                $orderItemsData[] = [
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ];
            }

            // =======================
            // CÁLCULO DE IVA
            // =======================

            // Base imponible: subtotal + envío
            $baseImponible = $subtotal + $shippingPrice;

            // IVA 21%
            $iva = $baseImponible * 0.21;

            // Total final con IVA
            $totalConIva = $baseImponible + $iva;


            // =======================
            // PREPARAR DATOS PARA CORREO
            // =======================
            $orderForMail = [
                'order_number' => $order->id,
                'customer_id' => $customer->id,
                'customer_name' => $order->delivery_name,
                'purchase_date' => now()->format('d/m/Y'),

                'delivery_email' => $order->delivery_email,

                'subtotal' => $subtotal,

                'shipping' => [
                    'method_name' => $shippingMethod->name,
                    'price' => $shippingPrice
                ],

                'iva_percentage' => 21,
                'iva_amount' => $iva,

                'total_without_iva' => $baseImponible,
                'total_with_iva' => $totalConIva,

                'items' => $orderItemsData
            ];



            $mailService->sendPurchaseMail($order->delivery_email, $orderForMail);

            // =======================
            // RETORNAR RESPUESTA JSON
            // =======================

            return [
                'order' => $this->orders->findById($order->id),
                'paypal' => [
                    'id' => $paypalOrder['id'],
                    'approve_url' => collect($paypalOrder['links'])
                        ->firstWhere('rel', 'approve')['href']
                ]
            ];

        } catch (\Exception $e) {
            // Rollback de la transacción de la base de datos
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Capturar pago de PayPal
     */
    public function capturePaypalPayment(int $orderId, string $paypalOrderId)
    {
        $order = $this->orders->findById($orderId);
        if (!$order) {
            throw new \Exception('Orden no encontrada');
        }

        $paypal = new PayPalService();
        $capture = $paypal->captureOrder($paypalOrderId);

        if ($capture['status'] !== 'COMPLETED') {
            throw new \Exception('Pago no completado');
        }

        $this->payments->updateStatus($orderId, 'completed', $capture);
        $order->update(['status' => 'paid']);

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

}
