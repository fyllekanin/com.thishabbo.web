<?php
namespace App\Http\Middleware;

use App\Utils\Condition;
use Closure;
use Illuminate\Support\Facades\Cache;

class CheckHabboVerified {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Cache::get('auth');
        Condition::precondition(!$user->habbo, 400, 'You need to verify habbo');
        return $next($request);
    }
}