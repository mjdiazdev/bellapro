<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Api\ShippingMethodController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\PostalCodeController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DistributionCenterController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('orders', [OrderController::class, 'create']); // Crear una orden
Route::post('orders/{orderId}/capture-paypal', [OrderController::class, 'capturePaypal']); // Capturar pago PayPal

// Rutas para autenticación
Route::post('login', [AuthController::class, 'login']);

// Buscar datos de localización por el código postal
Route::get('postal-codes/search/{code}', [PostalCodeController::class, 'search']);

// Rutas para provincias
Route::prefix('provinces')->group(function () {
    Route::get('/', [ProvinceController::class, 'list']);
    Route::get('/city/{cityId}', [ProvinceController::class, 'getByCity']);
});

// Rutas para ciudades
Route::prefix('cities')->group(function () {
    Route::get('/', [CityController::class, 'list']);
    Route::get('/province/{provinceId}', [CityController::class, 'getByProvince']);
});

// Rutas para códigos postales
Route::prefix('postal-codes')->group(function () {
    //Route::get('/', [PostalCodeController::class, 'list']);
    Route::get('/city/{cityId}', [PostalCodeController::class, 'getByCity']);
});

// Cargar métodos de envío de un centro de distribución de acuerdo el codigo postal
Route::get('/distribution-centers/shipping-methods', [DistributionCenterController::class, 'getShippingMethods']);

Route::get('qr/{code}', [CategoryController::class, 'showByCode']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas para autenticación
    Route::post('logout', [AuthController::class, 'logout']);

    /**
     * Rutas para la gestión de centros de distribución.
     */
    Route::get('/distribution-centers', [DistributionCenterController::class, 'list']);
    Route::post('/distribution-centers', [DistributionCenterController::class, 'create']);
    Route::get('/distribution-centers/{id}', [DistributionCenterController::class, 'show']);
    Route::put('/distribution-centers/{id}', [DistributionCenterController::class, 'update']);
    Route::delete('/distribution-centers/{id}', [DistributionCenterController::class, 'destroy']);

    /**
     * Rutas para la gestión de ordenes de pedido
     */
    Route::get('/orders', [OrderController::class, 'list']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Actualizar el estado de múltiples órdenes
    Route::post('orders/bulk-status', [OrderController::class, 'bulkStatusUpdate']);

    /**
     * Rutas para el panel de administración
     */
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'index']);

        // En el futuro, si quieres estadísticas por rangos:
        // Route::get('/stats/range', [DashboardController::class, 'customRange']);
    });
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // API de Usuarios (solo admin)
    Route::apiResource('users', UserController::class);

    // API de Roles (solo admin)
    Route::apiResource('roles', RoleController::class);

    // Categorías
    Route::post('/categories', [CategoryController::class,'create']);
    Route::get('/categories', [CategoryController::class,'list']);
    Route::get('/categories/{id}', [CategoryController::class,'show']);
    Route::put('/categories/{id}', [CategoryController::class,'update']);
    Route::delete('/categories/{id}', [CategoryController::class,'destroy']);

    // Productos
    Route::post('/products', [ProductController::class,'create']);
    Route::get('/products', [ProductController::class,'list']);
    Route::get('/products/{id}', [ProductController::class,'show']);
    Route::put('/products/{id}', [ProductController::class,'update']);
    Route::delete('/products/{id}', [ProductController::class,'destroy']);
    Route::post('/products/bulk-update', [ProductController::class, 'bulkUpdate']);
    Route::post('/products/import', [ImportController::class, 'upload']);

    /**
     * Rutas para la gestión de métodos de envío.
     */
    Route::prefix('shipping-methods')->group(function () {
        Route::post('/',  [ShippingMethodController::class, 'create']);   // Crear
        Route::get('/',   [ShippingMethodController::class, 'list']);     // Listar
        Route::get('/{id}', [ShippingMethodController::class, 'show']);   // Ver uno
        Route::put('/{id}', [ShippingMethodController::class, 'update']); // Actualizar
        Route::delete('/{id}', [ShippingMethodController::class, 'destroy']); // Eliminar
    });

    // Filtrar usuarios por rol
    Route::get('users/role/{roleName}', [UserController::class, 'getUsersByRole']);

});


// Productos por categoría
Route::get('/categories/{categoryId}/products', [ProductController::class,'listByCategory']);

// Rutas para clientes
Route::prefix('customers')->group(function () {
    Route::post('/', [CustomerController::class, 'create']);
    Route::get('/', [CustomerController::class, 'list']);
    Route::get('/{id}', [CustomerController::class, 'showById']);
    Route::put('/{id}', [CustomerController::class, 'updateById']);
    Route::delete('/{id}', [CustomerController::class, 'destroyById']);
    Route::get('/email/{email}', [CustomerController::class, 'show']);   // Consultar por email
    Route::put('/email/{email}', [CustomerController::class, 'update']); // Modificar por email
});

