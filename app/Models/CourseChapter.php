<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseChapter extends Model
{
    protected $fillable = ['course_module_id', 'title', 'description', 'sort_order'];

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    public function learningLogs()
    {
        return $this->hasMany(DailyLearningLog::class);
    }
}
