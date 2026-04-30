@extends('emails.base')

@section('content')
    <div style="margin-bottom: 20px; text-align: center;">
        <p style="font-size: 16px; color: #333; line-height: 1.6; text-align: center;">
            {{ $body ?? 'No message content provided.' }}
        </p>
    </div>
@endsection
