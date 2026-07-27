<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PaymentMethod extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
    ];
}
