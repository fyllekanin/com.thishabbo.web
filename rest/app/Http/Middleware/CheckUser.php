<?php

namespace App\Http\Middleware;

use App\EloquentModels\User\Token;
use App\EloquentModels\User\User;
use App\Utils\RequestUtil;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckUser {

    private $refreshRoute = '/api/auth/refresh';

    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $accessToken = RequestUtil::getAccessToken($request);
        $token = Token::where('accessToken', $accessToken)
            ->first();

        if ($token && $request->getPathInfo() != $this->refreshRoute && $token->expiresAt < time()) {
            throw new HttpException(419);
        }

        $defaultUser = (object) [
            'userId' => 0,
            'groupIds' => [0],
            'nickname' => 'no-one',
            'createdAt' => (object) ['timestamp' => 0],
            'posts' => 0,
            'likes' => 0,
            'lastActivity' => 0,
            'save' => function () {
            }
        ];

        $user = $token ? User::find($token->userId) : $defaultUser;
        if ($user->userId > 0) {
            $user->lastActivity = time();
            $user->save();
        }

        $request->attributes->set('auth', $user);
        return $next($request);
    }
}
