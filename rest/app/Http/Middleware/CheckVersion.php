<?php

namespace App\Http\Middleware;

use App\Helpers\ConfigHelper;
use App\Utils\RequestUtil;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckVersion {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {

       /* if (ConfigHelper::getVersion() != RequestUtil::getVersion($request)) {
            throw new HttpException(418, ConfigHelper::getVersion());
        }*/

        return $next($request);
    }
}
