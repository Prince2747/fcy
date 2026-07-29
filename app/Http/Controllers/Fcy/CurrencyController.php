<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CurrencyController extends Controller
{
    /**
     * Display a listing of currencies.
     */
    public function index(Request $request): Response
    {
        $query = Currency::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('symbol', 'like', "%{$search}%");
            });
        }

        $currencies = $query->orderBy('code')->paginate(10)->withQueryString();

        return Inertia::render('fcy/settings/currencies/index', [
            'currencies' => $currencies,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created currency.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:3', 'unique:currencies,code'],
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['nullable', 'string', 'max:10'],
        ]);

        $currency = Currency::create($validated);

        return redirect()->route('fcy.settings.currencies.index')
            ->with('success', "Currency '{$currency->code}' created successfully.");
    }

    /**
     * Update the specified currency.
     */
    public function update(Request $request, Currency $currency): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:3', 'unique:currencies,code,'.$currency->id],
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['nullable', 'string', 'max:10'],
        ]);

        $currency->update($validated);

        return redirect()->route('fcy.settings.currencies.index')
            ->with('success', "Currency '{$currency->code}' updated successfully.");
    }
}
