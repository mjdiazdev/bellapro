<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->redirectGuestsTo(function ($request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }
            return '/login';
        });
        // Middlewares de Spatie
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'QrCode' => SimpleSoftwareIO\QrCode\Facades\QrCode::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Respuesta traducida para APIs no autenticadas
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            return response()->json([
                'message' => __('auth.unauthenticated'),
            ], 401);
        });

        // Notificación por email cuando ocurre un error 500 en producción
        $exceptions->report(function (\Throwable $e) {
            if (app()->environment('production') && !($e instanceof \Illuminate\Auth\AuthenticationException)) {
                try {
                    \Illuminate\Support\Facades\Mail::raw(
                        implode("\n", [
                            "Error en BellaPro: " . get_class($e),
                            "Mensaje: " . $e->getMessage(),
                            "Archivo: " . $e->getFile() . " (línea " . $e->getLine() . ")",
                            "URL: " . request()->fullUrl(),
                            "Hora: " . now()->format('d/m/Y H:i:s'),
                        ]),
                        function ($message) {
                            $message->to('estudio@agenciatlc.es')
                                    ->subject('[BellaPro] Error en producción: ' . request()->path());
                        }
                    );
                } catch (\Throwable $mailError) {
                    // Si el mail falla, no interrumpimos el flujo
                }
            }
        });

    })
    ->create();
