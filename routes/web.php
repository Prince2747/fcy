<?php

use App\Http\Controllers\Fcy\CustomerController;
use App\Http\Controllers\Fcy\DashboardController;
use App\Http\Controllers\Fcy\FcyRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    return $request->user()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // FCY Portal routes
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('fcy')->name('fcy.')->group(function () {
        Route::resource('customers', CustomerController::class)
            ->only(['index', 'store', 'show', 'update', 'destroy'])
            ->names([
                'index' => 'customers.index',
                'store' => 'customers.store',
                'show' => 'customers.show',
                'update' => 'customers.update',
                'destroy' => 'customers.destroy',
            ]);

        // FCY Requests
        Route::resource('requests', FcyRequestController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

        // Workflow actions
        Route::post('requests/{fcy_request}/submit', [FcyRequestController::class, 'submit'])->name('requests.submit');
        Route::post('requests/{fcy_request}/check', [FcyRequestController::class, 'check'])->name('requests.check');
        Route::post('requests/{fcy_request}/reject-check', [FcyRequestController::class, 'rejectCheck'])->name('requests.reject-check');
        Route::post('requests/{fcy_request}/approve', [FcyRequestController::class, 'approve'])->name('requests.approve');
        Route::post('requests/{fcy_request}/reject', [FcyRequestController::class, 'reject'])->name('requests.reject');
    });
});
