<?php

namespace App\Http\Middleware;

use App\Utils\Condition;
use Closure;

class CheckHabboVerified {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $user = $request->get('auth');
        Condition::precondition(!$user || $user->userId == 0, 401, 'You are not logged in');
        Condition::precondition(!$user->habbo, 400, 'You need to verify habbo');
        return $next($request);
    }
}