@extends('emails.base')

@section('content')
    <h2>Course Purchased Successfully!</h2>
    <p>Hi {{ $name }},</p>
    <p>You have successfully purchased the course: <strong>{{ $course_name }}</strong>.</p>
    <p>Price: {{ $price }}</p>
    <p>You can start learning right away by clicking the button below:</p>
@endsection
