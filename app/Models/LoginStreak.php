<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginStreak extends Model
{
    protected $fillable = ['user_id', 'login_date', 'current_streak', 'longest_streak'];

    protected function casts(): array
    {
        return [
            'login_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record a login for a user. Updates streak if consecutive, resets if gap.
     * Skips Saturday and Sunday - streak continues from Friday to Monday.
     */
    public static function recordLogin(int $userId): self
    {
        $today = now();
        $todayStr = $today->toDateString();
        $isWeekend = $today->isWeekend();

        // Already logged today?
        $existing = static::where('user_id', $userId)->where('login_date', $todayStr)->first();
        if ($existing) {
            return $existing;
        }

        // Calculate streak
        $currentStreak = 1;
        
        // Determine the previous required login day
        // If today is Monday, previous is Friday
        // If today is Sunday, previous is Friday
        // If today is Saturday, previous is Friday
        // Otherwise, previous is yesterday
        $prevDate = now()->subDay();
        if ($today->isMonday()) {
            $prevDate = now()->subDays(3);
        } elseif ($today->isSunday()) {
            $prevDate = now()->subDays(2);
        } elseif ($today->isSaturday()) {
            $prevDate = now()->subDay(); // Still check yesterday (Friday)
        }

        $yesterdayRecord = static::where('user_id', $userId)
            ->where('login_date', $prevDate->toDateString())
            ->first();

        if ($yesterdayRecord) {
            // Only increment streak if today is NOT a weekend
            // Weekends are "bonus" or "neutral" - they maintain the streak but don't reset it
            $currentStreak = $yesterdayRecord->current_streak + ($isWeekend ? 0 : 1);
        }

        // Get user's all-time longest
        $longestEver = static::where('user_id', $userId)->max('longest_streak') ?? 0;
        $longest = max($longestEver, $currentStreak);

        try {
            return static::create([
                'user_id' => $userId,
                'login_date' => $todayStr,
                'current_streak' => $currentStreak,
                'longest_streak' => $longest,
            ]);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return static::where('user_id', $userId)->where('login_date', $todayStr)->first();
        }
    }

    /**
     * Get streak data for a user.
     */
    public static function getStreakData(int $userId): array
    {
        $today = now();
        $todayRecord = static::where('user_id', $userId)->where('login_date', $today->toDateString())->first();
        $longestEver = static::where('user_id', $userId)->max('longest_streak') ?? 0;
        $totalLogins = static::where('user_id', $userId)->count();

        // Get current week (Mon-Sun)
        $startOfWeek = now()->startOfWeek();
        $weekDays = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            $dateStr = $date->toDateString();
            $weekDays[] = [
                'date' => $dateStr,
                'day' => $date->format('D'),
                'is_weekend' => $date->isWeekend(),
                'logged' => static::where('user_id', $userId)->where('login_date', $dateStr)->exists(),
                'is_today' => $date->isToday(),
            ];
        }

        // Milestone badges
        $badges = [];
        $milestones = [3 => '🔥 3-Day', 7 => '⭐ Week', 14 => '💪 2-Week', 30 => '🏆 Month'];
        foreach ($milestones as $days => $name) {
            $badges[] = [
                'name' => $name,
                'days' => $days,
                'earned' => $longestEver >= $days,
            ];
        }

        return [
            'current_streak' => $todayRecord ? $todayRecord->current_streak : (static::where('user_id', $userId)->whereIn('login_date', [now()->subDay()->toDateString(), now()->subDays(2)->toDateString()])->exists() ? static::where('user_id', $userId)->latest('login_date')->first()?->current_streak ?? 0 : 0),
            'longest_streak' => $longestEver,
            'total_logins' => $totalLogins,
            'logged_today' => !!$todayRecord,
            'week_days' => $weekDays,
            'badges' => $badges,
        ];
    }
}
