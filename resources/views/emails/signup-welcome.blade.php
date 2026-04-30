@extends('emails.base')

@section('content')
    <h2>Welcome, {{ $name }}!</h2>
    <p>Thank you for signing up at {{ config('app.name') }}. We're excited to have you on board!</p>
    <p>You can now explore our courses and start learning.</p>
@endsection
