@extends('emails.base')

@section('content')
    <div style="margin-bottom: 20px;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            {!! nl2br(e($message)) !!}
        </p>
    </div>
@endsection
