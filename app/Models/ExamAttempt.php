<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    protected $fillable = ['exam_id', 'user_id', 'marks_obtained', 'completed_at'];

    protected $appends = ['score', 'status'];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getScoreAttribute()
    {
        if (!$this->exam || $this->exam->total_marks <= 0) return 0;
        return round(($this->marks_obtained / $this->exam->total_marks) * 100);
    }

    public function getStatusAttribute()
    {
        return $this->score >= 60 ? 'passed' : 'failed';
    }
}
