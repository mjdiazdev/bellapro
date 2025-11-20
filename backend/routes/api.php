<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\QrCodeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

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

//Api de login
Route::post('/login', [AuthController::class, 'login']);

//Grupo de rutas con autenticación
Route::middleware('auth:sanctum')->group(function () {

    // Info del usuario logueado
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD de usuarios (solo admins)
    Route::middleware('role:Super usuario|Administrador')->group(function () {

        Route::get('/users', [UserController::class, 'index']);        // Listar usuarios
        Route::post('/users', [UserController::class, 'store']);       // Crear usuario con rol
        Route::get('/users/{id}', [UserController::class, 'show']);    // Ver usuario
        Route::put('/users/{id}', [UserController::class, 'update']);  // Editar usuario
        Route::delete('/users/{id}', [UserController::class, 'destroy']); // Eliminar usuario
        Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']); // Asignar rol
    });

    // CRUD de roles
    Route::middleware('role:Super usuario|Administrador')->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::get('/roles/{id}', [RoleController::class, 'show']);
        Route::put('/roles/{id}', [RoleController::class, 'update']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
    });
});


//Rutas de productos
Route::get('/qr/{code}/products', [ProductController::class, 'getProductsByQr']);

//Gestión de QRs por los momentos sin autenticación
Route::prefix('qr')->group(function () {
    Route::get('/', [QrCodeController::class, 'index']);           // Listar QRs
    Route::post('/', [QrCodeController::class, 'store']);          // Crear QR
    Route::get('/{qr}', [QrCodeController::class, 'show']);       // Mostrar QR
    Route::put('/{qr}', [QrCodeController::class, 'update']);     // Editar QR
    Route::delete('/{qr}', [QrCodeController::class, 'destroy']); // Eliminar QR

    Route::post('/{qr}/assign-products', [QrCodeController::class, 'assignProducts']); // Asignar productos
});

// Rutas de productos
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);       // Listar productos
    Route::post('/', [ProductController::class, 'store']);      // Crear producto
    Route::get('/{product}', [ProductController::class, 'show']); // Ver producto
    Route::put('/{product}', [ProductController::class, 'update']); // Actualizar
    Route::delete('/{product}', [ProductController::class, 'destroy']); // Eliminar

    // Manejo de imágenes
    Route::post('/{product}/images', [ProductController::class, 'addImage']);
    Route::delete('/{product}/images/{image}', [ProductController::class, 'deleteImage']);
});
