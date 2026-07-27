<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FcyRole extends Model
{
    protected $connection = 'hr';

    protected $table = 'Gadaa-Hr1.dbo.roles';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->belongsToMany(
            HrUser::class,
            'Gadaa-Hr1.dbo.users_roles',
            'role_id',
            'user_id'
        );
    }
}
