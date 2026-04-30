<?php

namespace App\Http\Middleware;

use App\Models\LoginStreak;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackLoginStreak
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && !$request->session()->get('streak_tracked_today')) {
            LoginStreak::recordLogin($request->user()->id);
            $request->session()->put('streak_tracked_today', true);
        }

        return $next($request);
    }
}
