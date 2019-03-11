<?php
namespace App\Http\Middleware;
use App\Utils\Condition;
use Closure;
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
        $user = User::find($request->token->userId);
        Condition::precondition(!$user->habbo, 400, 'You need to verify habbo');
        return $next($request);
    }
}