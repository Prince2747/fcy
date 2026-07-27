<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $prefix
 * @property string|null $code
 * @property string|null $workUnit
 * @property string|null $description
 * @property string|null $location
 * @property string|null $acronym
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Workunit extends Model
{
    protected $connection = 'hr';

    protected $table = 'Gadaa-Hr1.dbo.workunits';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'prefix',
        'code',
        'workUnit',
        'description',
        'location',
        'acronym',
    ];
}
