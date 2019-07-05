<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckGdpr {

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

        if ($user && $user->userId > 0 && !$user->gdpr) {
            throw new HttpException(404, 'You need to accept gdpr!');
        }
        return $next($request);
    }
}
