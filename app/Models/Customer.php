<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $branch
 * @property string $importer_name
 * @property string $nbe_account_no
 * @property string $tin_number
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'branch',
        'importer_name',
        'nbe_account_no',
        'tin_number',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    /**
     * Normalize an identifier by stripping spaces, dashes, and dots, then uppercasing.
     */
    public static function normalizeIdentifier(string $value): string
    {
        return strtoupper(preg_replace('/[\s\-\.]/', '', trim($value)));
    }

    /**
     * Normalize the NBE account number before saving.
     */
    protected function nbeAccountNo(): Attribute
    {
        return Attribute::set(fn (?string $value) => ['nbe_account_no' => $value !== null ? self::normalizeIdentifier($value) : null]);
    }

    /**
     * Normalize the TIN number before saving.
     */
    protected function tinNumber(): Attribute
    {
        return Attribute::set(fn (?string $value) => ['tin_number' => $value !== null ? self::normalizeIdentifier($value) : null]);
    }
}
