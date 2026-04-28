<?php

use App\Http\Controllers\Admin\AssignmentController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Student\AcademicController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\EnrollmentController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\Teacher\WalletController;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return inertia('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'courses' => Course::where('is_active', true)->take(3)->get(),
    ]);
})->name('home');

Route::get('/courses', [CourseController::class, 'index'])->name('student.courses.index');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])->name('student.courses.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->is_admin) {
            return inertia('dashboard', [
                'stats' => [
                    'courses' => Course::count(),
                    'enrollments' => Enrollment::count(),
                    'revenue' => Payment::where('status', 'completed')->sum('amount'),
                ],
            ]);
        }

        return inertia('dashboard', [
            'enrollments' => $user->enrollments()->with(['course', 'batch', 'payment.invoice', 'certificate'])->get(),
        ]);
    })->name('dashboard');

    // Student Transactional Routes
    Route::post('/enroll/{course}', [EnrollmentController::class, 'store'])->name('student.enroll');
    Route::get('/enrollments/{enrollment}', [EnrollmentController::class, 'show'])->name('student.enrollments.show');
    Route::post('/enrollments/{enrollment}/payment', [EnrollmentController::class, 'processPayment'])->name('student.enrollments.payment');
    Route::get('/enrollments/{enrollment}/batch', [EnrollmentController::class, 'batchSelection'])->name('student.enrollments.batch');
    Route::post('/enrollments/{enrollment}/batch', [EnrollmentController::class, 'selectBatch'])->name('student.enrollments.select-batch');

    // Admin Routes
    Route::middleware(['can:admin'])->prefix('admin')->group(function () {
        Route::resource('courses', App\Http\Controllers\Admin\CourseController::class)->names('admin.courses');
        Route::resource('batches', BatchController::class)->names('admin.batches');
        Route::get('payments', [PaymentController::class, 'index'])->name('admin.payments.index');
        Route::get('payments/gst-report', [PaymentController::class, 'gstReport'])->name('admin.payments.gst-report');
        Route::get('payments/gst-report/export', [PaymentController::class, 'exportGstr1'])->name('admin.payments.gst-export');
        Route::get('invoices/{invoice}', [PaymentController::class, 'showInvoice'])->name('admin.invoices.show');
        Route::post('payments/{payment}/generate-invoice', [PaymentController::class, 'generateInvoice'])->name('admin.payments.generate-invoice');

        // Teachers Management
        Route::resource('teachers', TeacherController::class)->names('admin.teachers');

        // Student Management
        Route::get('students', [StudentController::class, 'index'])->name('admin.students.index');
        Route::get('students/qualified', [CertificateController::class, 'qualified'])->name('admin.students.qualified');
        Route::get('certificates', [CertificateController::class, 'index'])->name('admin.certificates.index');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('admin.students.show');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('admin.students.update');
        Route::post('students/{student}/enroll', [StudentController::class, 'manualEnroll'])->name('admin.students.manual-enroll');
        Route::patch('enrollments/{enrollment}/batch', [StudentController::class, 'updateBatch'])->name('admin.enrollments.update-batch');
        Route::post('enrollments/{enrollment}/certificate', [StudentController::class, 'generateCertificate'])->name('admin.enrollments.generate-certificate');

        // Academic Management (Assignments & Exams)
        Route::prefix('academic')->group(function () {
            Route::get('assignments', [AssignmentController::class, 'index'])->name('admin.assignments.index');
            Route::post('assignments', [AssignmentController::class, 'store'])->name('admin.assignments.store');
            Route::get('assignments/{assignment}', [AssignmentController::class, 'show'])->name('admin.assignments.show');
            Route::patch('submissions/{submission}/grade', [AssignmentController::class, 'grade'])->name('admin.submissions.grade');
            Route::post('submissions/{submission}/comment', [AssignmentController::class, 'comment'])->name('admin.submissions.comment');

            Route::get('exams', [ExamController::class, 'index'])->name('admin.exams.index');
            Route::post('exams', [ExamController::class, 'store'])->name('admin.exams.store');
            Route::get('exams/{exam}/questions', [ExamController::class, 'questions'])->name('admin.exams.questions');
            Route::post('exams/{exam}/questions', [ExamController::class, 'storeQuestion'])->name('admin.exams.questions.store');
            Route::post('exams/{exam}/questions/bulk', [ExamController::class, 'bulkStoreQuestions'])->name('admin.exams.questions.bulk');
            Route::delete('questions/{question}', [ExamController::class, 'destroyQuestion'])->name('admin.questions.destroy');
            Route::get('exams/{exam}/results', [ExamController::class, 'results'])->name('admin.exams.results');
            Route::patch('exam-attempts/{attempt}', [ExamController::class, 'updateResult'])->name('admin.exam-attempts.update');
        });

        // Settings
        Route::get('settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('settings', [SettingController::class, 'update'])->name('admin.settings.update');
    });

    // Student Academic Routes
    Route::prefix('my-course/{enrollment}')->group(function () {
        Route::get('assignments', [AcademicController::class, 'assignments'])->name('student.academic.assignments');
        Route::post('assignments/{assignment}', [AcademicController::class, 'submitAssignment'])->name('student.academic.submit-assignment');
        Route::get('exam', [AcademicController::class, 'exam'])->name('student.academic.exam');
        Route::post('exam/verify', [AcademicController::class, 'verifyPasscode'])->name('student.academic.verify-passcode');
        Route::post('exam', [AcademicController::class, 'submitExam'])->name('student.academic.submit-exam');
        Route::get('certificate', [AcademicController::class, 'certificate'])->name('student.academic.certificate');
    });

    // Teacher Routes
    Route::middleware(['can:teacher'])->prefix('teacher')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('teacher.dashboard');
        Route::resource('courses', App\Http\Controllers\Teacher\CourseController::class)->names('teacher.courses');
        Route::get('wallet', [WalletController::class, 'index'])->name('teacher.wallet');
    });

});

require __DIR__.'/settings.php';
