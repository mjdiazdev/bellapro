<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoryController;
Route::get('/categories/qrs/pdf', [CategoryController::class, 'downloadAllQRCodes']);

Route::get('/', function () {
    return view('welcome');
});
