<?php

namespace App\Models;

use Database\Factories\FcyRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $request_number
 * @property int $customer_id
 * @property string $proforma_invoice_number
 * @property string $proforma_invoice_date
 * @property int $payment_method_id
 * @property int $currency_id
 * @property float $fcy_amount_requested
 * @property float $total_amount_in_usd
 * @property string $importing_items
 * @property string $supplier_country
 * @property string $status
 * @property string $maker_id
 * @property string|null $checker_id
 * @property string|null $approver_id
 * @property string|null $maker_notes
 * @property string|null $checker_notes
 * @property string|null $approver_notes
 * @property Carbon|null $checked_at
 * @property Carbon|null $approved_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FcyRequest extends Model
{
    /** @use HasFactory<FcyRequestFactory> */
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_PENDING_CHECKER = 'pending_checker';

    public const STATUS_PENDING_APPROVER = 'pending_approver';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED_BY_CHECKER = 'rejected_by_checker';

    public const STATUS_REJECTED_BY_APPROVER = 'rejected_by_approver';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'request_number',
        'customer_id',
        'proforma_invoice_number',
        'proforma_invoice_date',
        'payment_method_id',
        'currency_id',
        'fcy_amount_requested',
        'total_amount_in_usd',
        'importing_items',
        'supplier_country',
        'status',
        'maker_id',
        'checker_id',
        'approver_id',
        'maker_notes',
        'checker_notes',
        'approver_notes',
        'checked_at',
        'approved_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'proforma_invoice_date' => 'date',
            'fcy_amount_requested' => 'decimal:2',
            'total_amount_in_usd' => 'decimal:2',
            'checked_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    /**
     * Generate the next request number: GDA-FCY-0000000001
     */
    public static function generateRequestNumber(): string
    {
        $lastRequest = self::query()
            ->where('request_number', 'like', 'GDA-FCY-%')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastRequest) {
            $lastNumber = (int) substr($lastRequest->request_number, -10);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return 'GDA-FCY-'.str_pad((string) $nextNumber, 10, '0', STR_PAD_LEFT);
    }
}
