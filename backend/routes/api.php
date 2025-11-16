<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;

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
