<?php

namespace App\Http\Middleware;

use App\EloquentModels\User\Token;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckToken {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle ($request, Closure $next) {
        $authorization = $request->header('Authorization');
        $parts = explode(' ', $authorization);
        $accessToken = isset($parts) && count($parts) > 1 ? $parts[1] : '';
        $token = Token::where('ip', $request->ip())
            ->where('accessToken', $accessToken)
            ->first();

        /** No token or invalid */
        if (!$token) {
            throw new HttpException(401);
        }

        /** Expired */
        if ($token->expiresAt < time()) {
            throw new HttpException(419);
        }

        if (!$token->user->gdpr) {
            throw new HttpException(404, 'You need to accept gdpr!');
        }

        $request->token = $token;
        return $next($request);
    }
}
