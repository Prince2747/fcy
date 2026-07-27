<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€'],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£'],
            ['code' => 'JPY', 'name' => 'Japanese Yen', 'symbol' => '¥'],
            ['code' => 'CAD', 'name' => 'Canadian Dollar', 'symbol' => 'C$'],
            ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$'],
            ['code' => 'CHF', 'name' => 'Swiss Franc', 'symbol' => 'Fr'],
            ['code' => 'CNY', 'name' => 'Chinese Yuan', 'symbol' => '¥'],
            ['code' => 'SEK', 'name' => 'Swedish Krona', 'symbol' => 'kr'],
            ['code' => 'NOK', 'name' => 'Norwegian Krone', 'symbol' => 'kr'],
            ['code' => 'DKK', 'name' => 'Danish Krone', 'symbol' => 'kr'],
            ['code' => 'INR', 'name' => 'Indian Rupee', 'symbol' => '₹'],
            ['code' => 'SAR', 'name' => 'Saudi Riyal', 'symbol' => '﷼'],
            ['code' => 'AED', 'name' => 'UAE Dirham', 'symbol' => 'د.إ'],
            ['code' => 'ETB', 'name' => 'Ethiopian Birr', 'symbol' => 'Br'],
        ];

        foreach ($currencies as $currency) {
            Currency::create($currency);
        }
    }
}
