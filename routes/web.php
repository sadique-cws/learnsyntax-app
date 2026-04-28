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
        Route::get('payments/gst-report', [App\Http\Controllers\Admin\PaymentController::class, 'gstReport'])->name('admin.payments.gst-report');
        Route::get('invoices/{invoice}', [App\Http\Controllers\Admin\PaymentController::class, 'showInvoice'])->name('admin.invoices.show');
        
        // Student Management
        Route::get('students', [App\Http\Controllers\Admin\StudentController::class, 'index'])->name('admin.students.index');
        Route::get('students/{student}', [App\Http\Controllers\Admin\StudentController::class, 'show'])->name('admin.students.show');
        Route::patch('enrollments/{enrollment}/batch', [App\Http\Controllers\Admin\StudentController::class, 'updateBatch'])->name('admin.enrollments.update-batch');

        // Academic Management (Assignments & Exams)
        Route::prefix('academic')->group(function () {
            Route::get('assignments', [App\Http\Controllers\Admin\AssignmentController::class, 'index'])->name('admin.assignments.index');
            Route::post('assignments', [App\Http\Controllers\Admin\AssignmentController::class, 'store'])->name('admin.assignments.store');
            Route::get('assignments/{assignment}', [App\Http\Controllers\Admin\AssignmentController::class, 'show'])->name('admin.assignments.show');
            Route::patch('submissions/{submission}/grade', [App\Http\Controllers\Admin\AssignmentController::class, 'grade'])->name('admin.submissions.grade');

            Route::get('exams', [App\Http\Controllers\Admin\ExamController::class, 'index'])->name('admin.exams.index');
            Route::post('exams', [App\Http\Controllers\Admin\ExamController::class, 'store'])->name('admin.exams.store');
            Route::get('exams/{exam}/questions', [App\Http\Controllers\Admin\ExamController::class, 'questions'])->name('admin.exams.questions');
            Route::post('exams/{exam}/questions', [App\Http\Controllers\Admin\ExamController::class, 'storeQuestion'])->name('admin.exams.questions.store');
            Route::post('exams/{exam}/questions/bulk', [App\Http\Controllers\Admin\ExamController::class, 'bulkStoreQuestions'])->name('admin.exams.questions.bulk');
            Route::delete('questions/{question}', [App\Http\Controllers\Admin\ExamController::class, 'destroyQuestion'])->name('admin.questions.destroy');
            Route::get('exams/{exam}/results', [App\Http\Controllers\Admin\ExamController::class, 'results'])->name('admin.exams.results');
            Route::patch('exam-attempts/{attempt}', [App\Http\Controllers\Admin\ExamController::class, 'updateResult'])->name('admin.exam-attempts.update');
        });
    });

    // Student Academic Routes
    Route::prefix('my-course/{enrollment}')->group(function () {
        Route::get('assignments', [App\Http\Controllers\Student\AcademicController::class, 'assignments'])->name('student.academic.assignments');
        Route::get('exam', [App\Http\Controllers\Student\AcademicController::class, 'exam'])->name('student.academic.exam');
        Route::post('exam', [App\Http\Controllers\Student\AcademicController::class, 'submitExam'])->name('student.academic.submit-exam');
        Route::get('certificate', [App\Http\Controllers\Student\AcademicController::class, 'certificate'])->name('student.academic.certificate');
    });
});

require __DIR__.'/settings.php';
