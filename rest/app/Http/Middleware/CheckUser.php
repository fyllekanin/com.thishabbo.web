<?php

namespace App\Http\Middleware;

use App\EloquentModels\User\Token;
use App\Helpers\UserHelper;
use App\Utils\RequestUtil;
use Closure;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckUser {
    private $refreshRoute = '/api/auth/refresh';

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $accessToken = RequestUtil::getAccessToken($request);
        $token = Token::where('ip', $request->ip())
            ->where('accessToken', $accessToken)
            ->first();
        
        if ($token && $request->getPathInfo() != $this->refreshRoute && $token->expiresAt < time()) {
            throw new HttpException(419);
        }

        $user = UserHelper::getUserFromId($token ? $token->userId : 0);
        if ($user->userId > 0) {
            $user->lastActivity = time();
            $user->save();
        }
        Cache::add('auth', $user, 9999);

        return $next($request);
    }
}
