@extends('emails.base')

@section('content')
    <div style="margin-bottom: 25px;">
        <h2 style="margin-top: 0;">Welcome to Learn Syntax, {{ $name }}!</h2>
        <p style="margin: 0 auto 20px; max-width: 480px;">
            We're thrilled to have you here. Your journey to becoming a master developer starts today. Let's build something amazing together!
        </p>
        
        <div style="margin-top: 30px; padding: 25px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: left;">
            <div style="font-size: 11px; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Quick Setup</div>
            <p style="margin: 0; font-size: 14px; color: #475569;">
                Dive into your first lesson and set your daily learning goal in the dashboard to keep the momentum going.
            </p>
        </div>
    </div>
@endsection
