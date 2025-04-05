<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json(['error' => 'Unauthorized'], 401));
        }

        return route('login');
    }
}
