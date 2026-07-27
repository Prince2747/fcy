<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFcyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['sometimes', 'required', 'exists:customers,id'],
            'proforma_invoice_number' => ['sometimes', 'required', 'string', 'max:255'],
            'proforma_invoice_date' => ['sometimes', 'required', 'date'],
            'payment_method_id' => ['sometimes', 'required', 'exists:payment_methods,id'],
            'currency_id' => ['sometimes', 'required', 'exists:currencies,id'],
            'fcy_amount_requested' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'total_amount_in_usd' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'importing_items' => ['sometimes', 'required', 'string'],
            'supplier_country' => ['sometimes', 'required', 'string', 'max:255'],
            'maker_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
