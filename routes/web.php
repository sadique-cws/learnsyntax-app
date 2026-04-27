<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return inertia('welcome', [
        'canRegister' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::registration()),
        'courses' => \App\Models\Course::where('is_active', true)->take(3)->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->is_admin) {
            return inertia('dashboard', [
                'stats' => [
                    'courses' => \App\Models\Course::count(),
                    'enrollments' => \App\Models\Enrollment::count(),
                    'revenue' => \App\Models\Payment::where('status', 'completed')->sum('amount'),
                ]
            ]);
        }

        return inertia('dashboard', [
            'enrollments' => $user->enrollments()->with(['course', 'batch', 'payment.invoice'])->get()
        ]);
    })->name('dashboard');

    // Student Course Routes
    Route::get('/courses', [App\Http\Controllers\Student\CourseController::class, 'index'])->name('student.courses.index');
    Route::get('/courses/{course:slug}', [App\Http\Controllers\Student\CourseController::class, 'show'])->name('student.courses.show');
    Route::post('/enroll/{course}', [App\Http\Controllers\Student\EnrollmentController::class, 'store'])->name('student.enroll');
    Route::get('/enrollments/{enrollment}', [App\Http\Controllers\Student\EnrollmentController::class, 'show'])->name('student.enrollments.show');
    Route::patch('/enrollments/{enrollment}', [App\Http\Controllers\Student\EnrollmentController::class, 'update'])->name('student.enrollments.update');

    // Admin Routes
    Route::middleware(['can:admin'])->prefix('admin')->group(function () {
        Route::resource('courses', App\Http\Controllers\Admin\CourseController::class)->names('admin.courses');
        Route::resource('batches', App\Http\Controllers\Admin\BatchController::class)->names('admin.batches');
        Route::get('payments', [App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('admin.payments.index');
    });
});

require __DIR__.'/settings.php';
