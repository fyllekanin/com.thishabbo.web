<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckAuth {


    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $user = $request->get('auth');

        /**
         *
         * No token or invalid
         */
        if ($user->userId == 0) {
            throw new HttpException(401);
        }

        return $next($request);
    }
}
