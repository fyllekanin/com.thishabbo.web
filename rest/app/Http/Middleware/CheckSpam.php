<?php

namespace App\Http\Middleware;

use App\Utils\Condition;
use Closure;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckSpam {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param $permission
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('get')) {
            return $next($request);
        }
        $ipAddress = $request->ip();
        $logTables = ['log_admin', 'log_staff', 'log_mod', 'log_user'];
        $minimumTime = time() - 5;
        foreach ($logTables as $table) {
            $isSpamming = DB::table($table)
                    ->where('ip', $ipAddress)
                    ->where('createdAt', '>', $minimumTime)
                    ->count() > 0;
            Condition::precondition($isSpamming, 400, 'Relax, you are pressing a little fast');
        }

        return $next($request);
    }
}
