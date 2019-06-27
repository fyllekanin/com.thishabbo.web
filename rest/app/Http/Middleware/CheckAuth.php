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
        $token = Token::where('userId', $user->userId)->where('ip', $request->ip())->first();

        /** No token or invalid */
        if (!$token) {
            throw new HttpException(401);
        }

        if (!$token->user->gdpr) {
            throw new HttpException(404, 'You need to accept gdpr!');
        }
        return $next($request);
    }
}
