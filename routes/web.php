<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return inertia('welcome', [
        'canRegister' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::registration()),
        'courses' => \App\Models\Course::where('is_active', true)->take(3)->get(),
    ]);
})->name('home');

Route::get('/courses', [App\Http\Controllers\Student\CourseController::class, 'index'])->name('student.courses.index');
Route::get('/courses/{course:slug}', [App\Http\Controllers\Student\CourseController::class, 'show'])->name('student.courses.show');

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

    // Student Transactional Routes
    Route::post('/enroll/{course}', [App\Http\Controllers\Student\EnrollmentController::class, 'store'])->name('student.enroll');
    Route::get('/enrollments/{enrollment}', [App\Http\Controllers\Student\EnrollmentController::class, 'show'])->name('student.enrollments.show');
    Route::post('/enrollments/{enrollment}/payment', [App\Http\Controllers\Student\EnrollmentController::class, 'processPayment'])->name('student.enrollments.payment');
    Route::get('/enrollments/{enrollment}/batch', [App\Http\Controllers\Student\EnrollmentController::class, 'batchSelection'])->name('student.enrollments.batch');
    Route::post('/enrollments/{enrollment}/batch', [App\Http\Controllers\Student\EnrollmentController::class, 'selectBatch'])->name('student.enrollments.select-batch');

    // Admin Routes
    Route::middleware(['can:admin'])->prefix('admin')->group(function () {
        Route::resource('courses', App\Http\Controllers\Admin\CourseController::class)->names('admin.courses');
        Route::resource('batches', App\Http\Controllers\Admin\BatchController::class)->names('admin.batches');
        Route::get('payments', [App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('admin.payments.index');
        
        // Student Management
        Route::get('students', [App\Http\Controllers\Admin\StudentController::class, 'index'])->name('admin.students.index');
        Route::get('students/{student}', [App\Http\Controllers\Admin\StudentController::class, 'show'])->name('admin.students.show');
        Route::patch('enrollments/{enrollment}/batch', [App\Http\Controllers\Admin\StudentController::class, 'updateBatch'])->name('admin.enrollments.update-batch');
    });
});

require __DIR__.'/settings.php';
