<?php

namespace App\Http\Requests;

use App\Support\Country;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFcyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('fcymaker') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'proforma_invoice_number' => ['required', 'string', 'max:255'],
            'proforma_invoice_date' => ['required', 'date'],
            'payment_method_id' => ['required', 'exists:payment_methods,id'],
            'currency_id' => ['required', 'exists:currencies,id'],
            'fcy_amount_requested' => ['required', 'numeric', 'min:0.01'],
            'total_amount_in_usd' => ['required', 'numeric', 'min:0.01'],
            'importing_items' => ['required', 'string'],
            'supplier_country' => ['required', 'string', Rule::in(Country::all())],
            'maker_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
