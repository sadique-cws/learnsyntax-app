<?php

use App\Http\Controllers\Admin\AssignmentController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Student\AcademicController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\EnrollmentController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\Teacher\KycController;
use App\Http\Controllers\Teacher\WalletController;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LoginStreak;
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
            $recentUsers = \App\Models\User::with('enrollments')->latest()->take(5)->get()->map(function($u) {
                return [
                    'name' => $u->name,
                    'email' => $u->email,
                    'initials' => collect(explode(' ', $u->name))->map(fn($n) => mb_substr($n, 0, 1))->join(''),
                    'role' => $u->is_admin ? 'ADMIN' : ($u->is_teacher ? 'TEACHER' : ($u->is_student ? 'STUDENT' : 'USER')),
                    'active' => true,
                    'color' => $u->is_admin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                ];
            });

            // Top streak leaders for admin monitoring
            $streakLeaders = LoginStreak::select('user_id')
                ->selectRaw('MAX(current_streak) as streak')
                ->selectRaw('MAX(longest_streak) as best')
                ->selectRaw('COUNT(*) as total_logins')
                ->selectRaw('MAX(login_date) as last_login')
                ->groupBy('user_id')
                ->orderByDesc('streak')
                ->take(10)
                ->get()
                ->map(function ($row) {
                    $user = \App\Models\User::find($row->user_id);
                    return [
                        'name' => $user?->name ?? 'Unknown',
                        'email' => $user?->email ?? '',
                        'streak' => $row->streak,
                        'best' => $row->best,
                        'total_logins' => $row->total_logins,
                        'last_login' => $row->last_login,
                    ];
                });

            return inertia('dashboard', [
                'stats' => [
                    'courses' => Course::count(),
                    'enrollments' => Enrollment::where('status', 'paid')->count(),
                    'revenue' => (float) Payment::where('status', 'completed')->sum('amount'),
                    'signups_this_week' => Enrollment::where('status', 'paid')->where('created_at', '>=', now()->subDays(7))->count(),
                    'recent_users' => $recentUsers,
                    'streak_leaders' => $streakLeaders,
                ],
            ]);
        }

        if ($user->is_teacher) {
            return redirect()->route('teacher.dashboard');
        }

        $enrollments = $user->enrollments()->where('status', 'paid')->with(['course', 'batch.assignments', 'certificate', 'payment.invoice'])->get();
        
        $allAssignments = collect();
        $availableExams = collect();

        foreach ($enrollments as $enrollment) {
            if ($enrollment->batch) {
                // Fetch all assignments for the batch with the user's submission
                $batchAssignments = $enrollment->batch->assignments()
                    ->with(['submissions' => function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }])->get();
                
                foreach($batchAssignments as $assignment) {
                    $assignment->enrollment_id = $enrollment->id;
                }
                
                $allAssignments = $allAssignments->merge($batchAssignments);
            }

            // Available exams for the course
            $courseExams = $enrollment->course->exams()
                ->where('is_active', true)
                ->with(['attempts' => function($q) use ($user) {
                    $q->where('user_id', $user->id);
                }])->get();
            
            foreach($courseExams as $exam) {
                $exam->enrollment_id = $enrollment->id;
                $exam->user_attempt = $exam->attempts->first();
            }
            $availableExams = $availableExams->merge($courseExams);

            // Check eligibility for certificate
            $enrollment->is_eligible = $enrollment->isEligibleForCertificate();
        }

        return inertia('dashboard', [
            'enrollments' => $enrollments,
            'assignments' => $allAssignments,
            'availableExams' => $availableExams,
            'is_student' => $user->is_student,
            'streak' => LoginStreak::getStreakData($user->id),
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
        Route::get('withdrawals', [TeacherController::class, 'withdrawals'])->name('admin.withdrawals.index');
        Route::post('withdrawals/{withdrawal}/status', [TeacherController::class, 'updateWithdrawalStatus'])->name('admin.withdrawals.status');
        Route::resource('teachers', TeacherController::class)->names('admin.teachers');
        Route::post('teachers/{teacher}/login-as', [TeacherController::class, 'loginAs'])->name('admin.teachers.login-as');
        // KYC Management
        Route::get('kyc', [\App\Http\Controllers\Admin\TeacherController::class, 'kycIndex'])->name('admin.kyc.index');
        Route::post('kyc/{teacher}/review', [\App\Http\Controllers\Admin\TeacherController::class, 'kycReview'])->name('admin.kyc.review');

        // User Management
        Route::resource('users', UserController::class)->names('admin.users');

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
            // Curriculum Management
            Route::get('courses/{course}/curriculum', [App\Http\Controllers\Admin\CourseController::class, 'curriculum'])->name('admin.courses.curriculum');
            Route::post('courses/{course}/modules', [App\Http\Controllers\Admin\CourseController::class, 'storeModule'])->name('admin.courses.modules.store');
            Route::patch('modules/{module}', [App\Http\Controllers\Admin\CourseController::class, 'updateModule'])->name('admin.modules.update');
            Route::delete('modules/{module}', [App\Http\Controllers\Admin\CourseController::class, 'destroyModule'])->name('admin.modules.destroy');
            Route::post('modules/{module}/chapters', [App\Http\Controllers\Admin\CourseController::class, 'storeChapter'])->name('admin.modules.chapters.store');
            Route::patch('chapters/{chapter}', [App\Http\Controllers\Admin\CourseController::class, 'updateChapter'])->name('admin.chapters.update');
            Route::delete('chapters/{chapter}', [App\Http\Controllers\Admin\CourseController::class, 'destroyChapter'])->name('admin.chapters.destroy');

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

        // Reports Management
        Route::prefix('reports')->group(function () {
            Route::get('top-strikers', [UserController::class, 'topStrikers'])->name('admin.reports.top-strikers');
        });

        // Settings
        Route::get('settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('settings', [SettingController::class, 'update'])->name('admin.settings.update');
    });

    // Student Academic Routes
    Route::prefix('my-course/{enrollment}')->group(function () {
        Route::get('progress', [AcademicController::class, 'progress'])->name('student.academic.progress');
        Route::get('assignments', [AcademicController::class, 'assignments'])->name('student.academic.assignments');
        Route::post('assignments/{assignment}', [AcademicController::class, 'submitAssignment'])->name('student.academic.submit-assignment');
        Route::get('exam', [AcademicController::class, 'exam'])->name('student.academic.exam');
        Route::post('exam/verify', [AcademicController::class, 'verifyPasscode'])->name('student.academic.verify-passcode');
        Route::post('exam', [AcademicController::class, 'submitExam'])->name('student.academic.submit-exam');
        Route::get('certificate', [AcademicController::class, 'certificate'])->name('student.academic.certificate');
    });

    // Global Academic Views
    Route::get('academic/learning', [AcademicController::class, 'myLearning'])->name('student.academic.learning');
    Route::get('academic/assignments', [AcademicController::class, 'allAssignments'])->name('student.academic.all-assignments');
    Route::get('academic/exams', [AcademicController::class, 'allExams'])->name('student.academic.all-exams');
    Route::get('academic/payments', [AcademicController::class, 'allPayments'])->name('student.academic.all-payments');

    // Teacher Routes
    Route::middleware(['can:teacher'])->prefix('teacher')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('teacher.dashboard');
        Route::get('students', [DashboardController::class, 'students'])->name('teacher.students');
        Route::post('courses/{course}/batches', [App\Http\Controllers\Teacher\CourseController::class, 'storeBatch'])->name('teacher.courses.batches.store');
        Route::resource('courses', App\Http\Controllers\Teacher\CourseController::class)->names('teacher.courses');
        Route::get('wallet', [WalletController::class, 'index'])->name('teacher.wallet');
        Route::get('wallet/withdraw', [WalletController::class, 'withdraw'])->name('teacher.wallet.withdraw.page');
        Route::post('wallet/withdraw', [WalletController::class, 'storeRequest'])->name('teacher.wallet.withdraw');
        // KYC
        Route::get('kyc', [KycController::class, 'show'])->name('teacher.kyc');
        Route::post('kyc', [KycController::class, 'store'])->name('teacher.kyc.store');

        // Learning Progress & Logs
        Route::get('progress', [DashboardController::class, 'progressIndex'])->name('teacher.progress.index');
        Route::get('batches/{batch}/progress', [DashboardController::class, 'progress'])->name('teacher.batches.progress');
        Route::post('batches/{batch}/progress', [DashboardController::class, 'storeLog'])->name('teacher.batches.progress.store');

        // Academic Management (Assignments)
        Route::get('assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'index'])->name('teacher.assignments.index');
        Route::post('assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'store'])->name('teacher.assignments.store');
        Route::patch('assignments/{assignment}', [\App\Http\Controllers\Teacher\AssignmentController::class, 'update'])->name('teacher.assignments.update');
        Route::get('assignments/{assignment}', [\App\Http\Controllers\Teacher\AssignmentController::class, 'show'])->name('teacher.assignments.show');
        Route::patch('submissions/{submission}/grade', [\App\Http\Controllers\Teacher\AssignmentController::class, 'grade'])->name('teacher.submissions.grade');
        Route::post('submissions/{submission}/comment', [\App\Http\Controllers\Teacher\AssignmentController::class, 'comment'])->name('teacher.submissions.comment');
        // Progress Logging
        Route::get('progress', [DashboardController::class, 'progressIndex'])->name('teacher.progress.index');
        Route::get('batches/{batch}/progress', [DashboardController::class, 'progress'])->name('teacher.batches.progress');
        Route::post('batches/{batch}/progress', [DashboardController::class, 'storeLog'])->name('teacher.batches.progress.store');
    });

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

});

require __DIR__.'/settings.php';
