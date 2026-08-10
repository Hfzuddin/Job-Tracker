<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_name',
        'platform',
        'status',
        'applied_date',
        'notes',
    ];

    protected $casts = [
        'applied_date' => 'date',
    ];

    // Valid statuses, also used for validation in the controller
    public const STATUSES = ['applied', 'reviewed', 'interview', 'offer', 'rejected'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
