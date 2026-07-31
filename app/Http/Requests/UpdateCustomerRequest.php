<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize NBE account number and TIN number before validation
     * so the unique check compares normalized values.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('nbe_account_no')) {
            $this->merge([
                'nbe_account_no' => Customer::normalizeIdentifier($this->input('nbe_account_no')),
            ]);
        }

        if ($this->has('tin_number')) {
            $this->merge([
                'tin_number' => Customer::normalizeIdentifier($this->input('tin_number')),
            ]);
        }
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'branch' => ['required', 'string', 'max:255'],
            'importer_name' => ['required', 'string', 'max:255'],
            'nbe_account_no' => ['required', 'string', 'max:255', 'unique:customers,nbe_account_no,'.$customerId],
            'tin_number' => ['required', 'string', 'max:255', 'unique:customers,tin_number,'.$customerId],
        ];
    }
}
