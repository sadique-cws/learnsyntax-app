<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['course_id', 'name', 'type', 'start_date', 'capacity', 'is_active'])]
class Batch extends Model
{
    use HasFactory;

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function learningLogs()
    {
        return $this->hasMany(DailyLearningLog::class);
    }
}
