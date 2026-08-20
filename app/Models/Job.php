<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_postings';

    public const FOLLOW_UP_AFTER_DAYS = 7;

    protected $fillable = [
        'company_name',
        'job_name',
        'platform',
        'location',
        'date_applied',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Applications stuck in an early stage for long enough that a follow-up is worth sending.
     */
    public function scopeNeedsFollowUp($query, int $days = self::FOLLOW_UP_AFTER_DAYS)
    {
        return $query
            ->whereIn('status', ['applied', 'reviewed'])
            ->where('date_applied', '<=', now()->subDays($days));
    }
}
