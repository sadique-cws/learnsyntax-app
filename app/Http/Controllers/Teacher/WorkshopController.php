<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WorkshopController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $workshops = $teacher->workshops()
            ->withCount([
                'enrollments as paid_enrollments_count' => function ($query) {
                    $query->where('status', 'paid');
                },
            ])
            ->with(['enrollments' => function ($query) {
                $query->where('status', 'paid')->with('user');
            }])
            ->latest()
            ->get();

        return inertia('teacher/workshops/index', [
            'workshops' => $workshops,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fee' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:0.5',
            'starts_at' => 'required|date',
            'topics' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'image' => 'nullable|image|max:4096',
        ]);

        $teacher = auth()->user()->teacher;

        // Create the workshop (Course record)
        $workshop = $teacher->workshops()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.uniqid(),
            'type' => 'workshop',
            'description' => $validated['description'] ?? null,
            'price' => $validated['fee'],
            'meta' => null,
            'is_active' => true,
        ]);

        // Create initial batch for the workshop and store schedule/details in batch.meta
        $workshop->batches()->create([
            'name' => $validated['title'].' - Batch 1',
            'type' => 'online',
            'start_date' => $validated['starts_at'],
            'capacity' => $validated['capacity'] ?? 0,
            'meta' => [
                'duration_hours' => (float) $validated['duration_hours'],
                'starts_at' => $validated['starts_at'],
                'topics' => $this->topicsToArray($validated['topics'] ?? null),
                'venue' => $validated['venue'] ?? null,
                'capacity' => $validated['capacity'] ?? null,
            ],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('workshops', 'public');
            $workshop->update(['image_path' => $path]);
        }

        return back()->with('success', 'Workshop created successfully.');
    }

    public function show(Course $workshop)
    {
        abort_unless($workshop->type === 'workshop', 404);
        abort_unless($workshop->teacher_id === auth()->user()->teacher->id, 403);

        return inertia('teacher/workshops/show', [
            'workshop' => $workshop->load([
                'batches' => function ($query) {
                    $query->withCount(['enrollments as paid_enrollments_count' => function ($q) {
                        $q->where('status', 'paid');
                    }])->with(['enrollments' => function ($q) {
                        $q->where('status', 'paid')->with('user');
                    }]);
                },
            ])->loadCount([
                'enrollments as paid_enrollments_count' => function ($query) {
                    $query->where('status', 'paid');
                },
            ]),
        ]);
    }

    public function update(Request $request, Course $workshop)
    {
        abort_unless($workshop->type === 'workshop', 404);
        abort_unless($workshop->teacher_id === auth()->user()->teacher->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fee' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:0.5',
            'starts_at' => 'required|date',
            'topics' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'image' => 'nullable|image|max:4096',
        ]);

        $workshop->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['fee'],
        ]);

        // Update first batch's meta/schedule (if exists)
        $batch = $workshop->batches()->orderBy('start_date')->first();
        if ($batch) {
            $batch->update([
                'start_date' => $validated['starts_at'],
                'capacity' => $validated['capacity'] ?? $batch->capacity,
                'meta' => [
                    'duration_hours' => (float) $validated['duration_hours'],
                    'starts_at' => $validated['starts_at'],
                    'topics' => $this->topicsToArray($validated['topics'] ?? null),
                    'venue' => $validated['venue'] ?? null,
                    'capacity' => $validated['capacity'] ?? null,
                ],
            ]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('workshops', 'public');
            $workshop->update(['image_path' => $path]);
        }

        return back()->with('success', 'Workshop updated successfully.');
    }

    // Allow teachers to create additional batches for a workshop
    public function storeBatch(Request $request, Course $workshop)
    {
        abort_unless($workshop->type === 'workshop', 404);
        abort_unless($workshop->teacher_id === auth()->user()->teacher->id, 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:online,offline',
            'start_date' => 'required|date',
            'capacity' => 'required|integer|min:1',
            'duration_hours' => 'nullable|numeric|min:0.5',
            'topics' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
        ]);

        $workshop->batches()->create([
            'name' => $request->name,
            'type' => $request->type,
            'start_date' => $request->start_date,
            'capacity' => $request->capacity,
            'meta' => [
                'duration_hours' => isset($request->duration_hours) ? (float) $request->duration_hours : null,
                'starts_at' => $request->start_date,
                'topics' => $this->topicsToArray($request->topics ?? null),
                'venue' => $request->venue ?? null,
                'capacity' => $request->capacity,
            ],
        ]);

        return redirect()->back()->with('success', 'Batch created successfully.');
    }

    private function topicsToArray(?string $topics): ?array
    {
        if (! $topics) {
            return null;
        }

        return collect(explode(',', $topics))
            ->map(fn ($topic) => trim($topic))
            ->filter()
            ->values()
            ->all();
    }
}
