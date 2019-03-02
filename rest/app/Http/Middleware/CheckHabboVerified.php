<?php

namespace App\Http\Middleware;

use App\Helpers\UserHelper;
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
        $userData = UserHelper::getUserDataOrCreate($request->token->userId);
        Condition::precondition(!$userData->habbo, 400, 'You need to verify habbo');

        return $next($request);
    }
}
