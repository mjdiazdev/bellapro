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
Route::post('orders', [OrderController::class, 'create']); // Crear
Route::get('/orders', [OrderController::class, 'list']);
Route::get('/orders/{id}', [OrderController::class, 'show']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Rutas para provincias
Route::prefix('provinces')->group(function () {
    Route::get('/', [ProvinceController::class, 'list']);
    Route::get('/city/{cityId}', [ProvinceController::class, 'getByCity']);
});

// Rutas para ciudades
Route::prefix('cities')->group(function () {
    Route::get('/', [CityController::class, 'list']);
    Route::get('/postal/{postalCode}', [CityController::class, 'getByPostalCode']);
});

// Rutas para códigos postales
Route::prefix('postal-codes')->group(function () {
    Route::get('/', [PostalCodeController::class, 'list']);
});

Route::get('qr/{code}', [CategoryController::class, 'showByCode']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('logout', [AuthController::class, 'logout']);
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
});


// Productos por categoría
Route::get('/categories/{categoryId}/products', [ProductController::class,'listByCategory']);

// Rutas para clientes
Route::prefix('customers')->group(function () {
    Route::post('/', [CustomerController::class, 'create']);
    Route::get('/', [CustomerController::class, 'list']);
    Route::get('/email/{email}', [CustomerController::class, 'show']);   // Consultar por email
    Route::put('/email/{email}', [CustomerController::class, 'update']); // Modificar por email
    Route::delete('/nif/{nif}', [CustomerController::class, 'destroy']); // Eliminar por NIF
});

