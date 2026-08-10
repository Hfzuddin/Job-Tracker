<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_postings';

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
}
