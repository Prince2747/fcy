<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['name' => 'Cash Against Documents', 'code' => 'CAD'],
            ['name' => 'Letter of Credit', 'code' => 'LC'],
            ['name' => 'Telegraphic Transfer', 'code' => 'TT'],
            ['name' => 'Franco Valuta', 'code' => 'FRANCO VALUTA'],
        ];

        foreach ($methods as $method) {
            PaymentMethod::create($method);
        }
    }
}
