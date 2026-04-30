<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyLearningLog extends Model
{
    protected $fillable = ['batch_id', 'course_chapter_id', 'teacher_id', 'date', 'remarks'];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function chapter()
    {
        return $this->belongsTo(CourseChapter::class, 'course_chapter_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
