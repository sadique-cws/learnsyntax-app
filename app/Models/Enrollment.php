<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'course_id', 'batch_id', 'status', 'batch_type_preference'])]
class Enrollment extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class);
    }

    public function getAssignmentAverageAttribute()
    {
        if (!$this->batch_id) return 0;

        $assignments = Assignment::where('batch_id', $this->batch_id)->get();
        if ($assignments->isEmpty()) return 100; // Assume 100 if no assignments yet

        $totalPossible = $assignments->sum('max_marks');
        $totalObtained = AssignmentSubmission::where('user_id', $this->user_id)
            ->whereIn('assignment_id', $assignments->pluck('id'))
            ->sum('marks_obtained');

        return $totalPossible > 0 ? ($totalObtained / $totalPossible) * 100 : 100;
    }

    public function getExamScoreAttribute()
    {
        $exam = Exam::where('course_id', $this->course_id)->first();
        if (!$exam) return 0;

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('user_id', $this->user_id)
            ->first();

        return $attempt ? ($attempt->marks_obtained / $exam->total_marks) * 100 : 0;
    }

    public function getOverallAverageAttribute()
    {
        $assignmentAvg = $this->assignment_average;
        $examScore = $this->exam_score;

        return ($assignmentAvg + $examScore) / 2;
    }

    public function isEligibleForCertificate()
    {
        return $this->overall_average >= 60;
    }
}
