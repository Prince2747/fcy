<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of payment methods.
     */
    public function index(Request $request): Response
    {
        $query = PaymentMethod::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $paymentMethods = $query->orderBy('name')->paginate(5)->withQueryString();

        return Inertia::render('fcy/settings/payment-methods/index', [
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created payment method.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', 'unique:payment_methods,code'],
        ]);

        $paymentMethod = PaymentMethod::create($validated);

        return redirect()->route('fcy.settings.payment-methods.index')
            ->with('success', "Payment method '{$paymentMethod->name}' created successfully.");
    }

    /**
     * Update the specified payment method.
     */
    public function update(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', 'unique:payment_methods,code,'.$paymentMethod->id],
        ]);

        $paymentMethod->update($validated);

        return redirect()->route('fcy.settings.payment-methods.index')
            ->with('success', "Payment method '{$paymentMethod->name}' updated successfully.");
    }
}
