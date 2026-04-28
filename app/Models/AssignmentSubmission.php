<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    protected $fillable = [
        'assignment_id',
        'user_id',
        'content',
        'file_path',
        'submitted_at',
        'marks_obtained',
        'status',
        'admin_comments',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    protected $appends = ['is_late'];

    public function getIsLateAttribute()
    {
        if (! $this->submitted_at || ! $this->assignment->due_date) {
            return false;
        }

        return $this->submitted_at->isAfter($this->assignment->due_date);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
