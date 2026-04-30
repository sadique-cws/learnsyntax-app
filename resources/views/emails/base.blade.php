<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? config('app.name') }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            padding: 40px 0;
            background-color: #f8fafc;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 580px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #e2e8f0;
        }
        .top-accent {
            height: 4px;
            background-color: #4f46e5;
        }
        .header {
            padding: 40px 40px 30px;
            text-align: center;
        }
        .logo-text {
            font-size: 20px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.01em;
            text-transform: uppercase;
        }
        .content {
            padding: 0 40px 40px;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 25px;
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        .footer {
            padding: 30px 40px;
            background-color: #f1f5f9;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-links a {
            color: #64748b;
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
            margin: 0 10px;
        }
        .footer-text {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 20px;
            line-height: 1.6;
        }
        .tips-container {
            margin-top: 30px;
            padding: 20px;
            background-color: #f5f3ff;
            border-radius: 8px;
            border: 1px solid #ddd6fe;
        }
        .tips-label {
            font-size: 10px;
            font-weight: 800;
            color: #7c3aed;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 5px;
        }
        .tips-body {
            font-size: 13px;
            color: #5b21b6;
            font-weight: 500;
        }
        h2 {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 15px;
        }
        p {
            font-size: 15px;
            color: #475569;
            line-height: 1.7;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main">
            <div class="top-accent"></div>
            <div class="header">
                <div class="logo-text">LEARN SYNTAX</div>
            </div>
            <div class="content">
                @yield('content')

                @if(isset($link))
                    <div>
                        <a href="{{ $link }}" class="button">{{ $button_text ?? 'View Details' }}</a>
                    </div>
                @endif

                <div class="tips-container">
                    <div class="tips-label">Mastery Tip</div>
                    <div class="tips-body">Don't just watch, build! Try to apply today's learning to a small real-world project to solidify your skills.</div>
                </div>
            </div>
            <div class="footer">
                <div class="footer-links">
                    <a href="{{ url('/dashboard') }}">DASHBOARD</a>
                    <a href="{{ url('/courses') }}">EXPLORE</a>
                    <a href="{{ url('/support') }}">GET HELP</a>
                </div>
                <div class="footer-text">
                    &copy; {{ date('Y') }} Learn Syntax. All rights reserved.<br>
                    You are receiving this because you're enrolled in our learning platform.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
