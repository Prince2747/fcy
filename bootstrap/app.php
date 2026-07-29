<?php

use App\Http\Middleware\CheckFcyRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => CheckFcyRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (
            AuthorizationException $e,
            Request $request
        ) {
            if ($request->header('X-Inertia')) {
                return redirect()
                    ->back()
                    ->with('toast', [
                        'type' => 'error',
                        'message' => $e->getMessage()
                            ?: 'You are not authorized to perform this action.',
                    ]);
            }

            return null;
        });

        $exceptions->render(function (
            HttpException $e,
            Request $request
        ) {
            if (! $request->header('X-Inertia')) {
                return null;
            }

            // 401 — redirect to login for Inertia requests
            if ($e->getStatusCode() === 401) {
                return redirect()->guest(route('login'));
            }

            // 403 — show a clear, user-friendly error toast instead of the
            // default HTML error page that Inertia would render in a modal.
            if ($e->getStatusCode() === 403) {
                return redirect()
                    ->back()
                    ->with('toast', [
                        'type' => 'error',
                        'message' => $e->getMessage()
                            ?: 'You do not have permission to perform this action.',
                    ]);
            }

            return null;
        });
    })
    ->create();
