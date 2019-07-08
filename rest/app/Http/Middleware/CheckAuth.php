<?php

namespace App\Http\Middleware;

use App\EloquentModels\User\Token;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckAuth {

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
        $token = Token::where('userId', $user->userId)
            ->first();

        /** No token or invalid */
        if (!$token) {
            throw new HttpException(401);
        }

        return $next($request);
    }
}
