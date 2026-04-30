@extends('emails.base')

@section('content')
    <div style="margin-bottom: 25px;">
        <h2 style="margin-top: 0;">Update for You</h2>
        <p style="margin: 0 auto; max-width: 480px;">
            {{ $body ?? 'We have an important update regarding your account or course progress. Please review the details below to stay on track.' }}
        </p>
    </div>
@endsection
