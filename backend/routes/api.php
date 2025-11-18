<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\QrCodeController;

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
    //Rutas de usuarios
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard-data', function (Request $r) {
        return [
            'stats' => [
                'users' => \App\Models\User::count()
            ]
        ];
    })->middleware('role:Super usuario|Administrador');
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
