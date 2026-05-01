<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

#[Fillable(['title', 'slug', 'type', 'meta', 'description', 'price', 'image_path', 'is_active', 'teacher_id'])]
class Course extends Model
{
    use HasFactory;

    protected $appends = [
        'fee',
        'duration_hours',
        'starts_at',
        'topics',
        'venue',
        'capacity',
        'is_workshop',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'meta' => 'array',
        ];
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function isWorkshop(): bool
    {
        return $this->type === 'workshop';
    }

    public function getIsWorkshopAttribute(): bool
    {
        return $this->isWorkshop();
    }

    // Prefer course.meta but fallback to the first batch's meta/start_date when available
    public function getDurationHoursAttribute(): ?float
    {
        if (! $this->isWorkshop()) {
            return null;
        }

        $fromCourse = $this->metaValue('duration_hours');
        if (filled($fromCourse)) {
            return (float) $fromCourse;
        }

        $batch = $this->batches()->orderBy('start_date')->first();

        return $batch ? data_get($batch->meta ?? [], 'duration_hours') : null;
    }

    public function getFeeAttribute(): ?float
    {
        return $this->isWorkshop() ? (float) $this->price : null;
    }

    public function getStartsAtAttribute(): ?Carbon
    {
        if (! $this->isWorkshop()) {
            return null;
        }

        $startsAt = $this->metaValue('starts_at');
        if (filled($startsAt)) {
            return Carbon::parse($startsAt);
        }

        $batch = $this->batches()->orderBy('start_date')->first();
        if (! $batch) {
            return null;
        }

        $bStarts = data_get($batch->meta ?? [], 'starts_at');

        return filled($bStarts) ? Carbon::parse($bStarts) : ($batch->start_date ? Carbon::parse($batch->start_date) : null);
    }

    public function getTopicsAttribute(): ?array
    {
        if (! $this->isWorkshop()) {
            return null;
        }

        $fromCourse = $this->metaValue('topics');
        if (filled($fromCourse)) {
            return $fromCourse;
        }

        $batch = $this->batches()->orderBy('start_date')->first();

        return $batch ? data_get($batch->meta ?? [], 'topics') : null;
    }

    public function getVenueAttribute(): ?string
    {
        if (! $this->isWorkshop()) {
            return null;
        }

        $fromCourse = $this->metaValue('venue');
        if (filled($fromCourse)) {
            return $fromCourse;
        }

        $batch = $this->batches()->orderBy('start_date')->first();

        return $batch ? data_get($batch->meta ?? [], 'venue') : null;
    }

    public function getCapacityAttribute(): ?int
    {
        if (! $this->isWorkshop()) {
            return null;
        }

        $capacity = $this->metaValue('capacity');
        if (filled($capacity)) {
            return (int) $capacity;
        }

        $batch = $this->batches()->orderBy('start_date')->first();
        if (! $batch) {
            return null;
        }

        $bCap = data_get($batch->meta ?? [], 'capacity');

        return filled($bCap) ? (int) $bCap : (filled($batch->capacity) ? (int) $batch->capacity : null);
    }

    protected function metaValue(string $key): mixed
    {
        return data_get($this->meta ?? [], $key);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function exam()
    {
        return $this->hasOne(Exam::class)->latestOfMany();
    }

    public function modules()
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order');
    }
}
