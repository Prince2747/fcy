<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;

class HandleInertiaRequestsWithToasts
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (AuthorizationException $e) {
            if ($request->expectsJson() || $request->inertia()) {
                return redirect()->back()->with([
                    'toast' => [
                        'type' => 'error',
                        'message' => $e->getMessage() ?: 'You are not authorized to perform this action.',
                    ],
                ]);
            }

            abort(403, $e->getMessage());
        } catch (ValidationException $e) {
            if ($request->expectsJson() || $request->inertia()) {
                return redirect()->back()->with([
                    'toast' => [
                        'type' => 'error',
                        'message' => 'Please check the form for errors.',
                    ],
                    'errors' => $e->errors(),
                ])->withInput();
            }

            throw $e;
        }
    }
}