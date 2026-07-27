<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $userId
 * @property string $firstname
 * @property string $middlename
 * @property string $lastname
 * @property string $username
 * @property string $password
 * @property string|null $email
 * @property string|null $remember_token
 * @property string $isActive
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class HrUser extends Authenticatable
{
    use Notifiable, HasFactory;

    protected $connection = 'hr';

    protected $table = 'Gadaa-Hr1.dbo.users';

    protected $primaryKey = 'id';

    protected $fillable = [
        'username',
        'password',
        'remember_token',
        'firstname',
        'middlename',
        'lastname',
        'email',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'name',
        'avatar',
    ];

    /**
     * Check if the user has a specific role from the HR roles table.
     */
    public function hasRole(string $roleName): bool
    {
        return FcyRole::query()
            ->join('Gadaa-Hr1.dbo.users_roles', 'roles.id', '=', 'users_roles.role_id')
            ->where('roles.name', $roleName)
            ->where('users_roles.user_id', $this->id)
            ->exists();
    }

    /**
     * Get the user's FCY roles from the HR database.
     *
     * @return list<string>
     */
    public function getFcyRoles(): array
    {
        return FcyRole::query()
            ->join('Gadaa-Hr1.dbo.users_roles', 'roles.id', '=', 'users_roles.role_id')
            ->where('users_roles.user_id', $this->id)
            ->whereIn('roles.name', ['fcymaker', 'fcychecker', 'fcyapprover'])
            ->pluck('roles.name')
            ->toArray();
    }

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function getNameAttribute(): string
    {
        $name = trim("{$this->firstname} {$this->middlename} {$this->lastname}");

        return $name ?: $this->username;
    }

    public function getAvatarAttribute(): ?string
    {
        // Check for common profile picture field names in the HR database
        // Update this to match your actual field name
        $photoFields = ['profile_photo', 'photo', 'avatar', 'profile_picture', 'image'];

        foreach ($photoFields as $field) {
            if (! empty($this->$field)) {
                // If the field contains a URL, return it directly
                if (filter_var($this->$field, FILTER_VALIDATE_URL)) {
                    return $this->$field;
                }

                // If it's a file path, return the full path
                // Adjust the path based on your storage configuration
                return "/storage/profile-photos/{$this->$field}";
            }
        }

        return null;
    }
}
