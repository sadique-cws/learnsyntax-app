<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = ['batch_id', 'title', 'description', 'max_marks', 'due_date'];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }
}
