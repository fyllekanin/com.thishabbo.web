<?php

namespace App\Http\Controllers\Search;

use App\Http\Controllers\Controller;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IpSearchController extends Controller {
    
    public function getIpSearch(Request $request) {
        $nickname = $request->input('nickname');
        $ipAddress = $request->input('ip');

        if (!$nickname && !$ipAddress) {
            return response()->json([]);
        }

        $items = [];
        $logTables = ['login', 'log_sitecp', 'log_staff', 'log_mod', 'log_user'];
        foreach ($logTables as $table) {
            $items = array_merge(
                $items,
                DB::table($table)
                    ->join('users', 'users.userId', '=', $table.'.userId')
                    ->where(
                        function ($query) use ($request, $nickname, $ipAddress) {
                            if ($nickname) {
                                $query->where('users.nickname', 'LIKE', Value::getFilterValue($request, $nickname));
                            }

                            if ($ipAddress) {
                                $query->where('ip', 'LIKE', Value::getFilterValue($request, $ipAddress));
                            }
                        }
                    )
                    ->select($table.'.userId', $table.'.ip', $table.'.createdAt', 'users.nickname', 'users.userId')
                    ->get()
                    ->toArray()
            );
        }

        $dateSorted = Iterables::sortByPropertyDesc($items, 'createdAt');
        $unique = Iterables::unique($dateSorted, 'userId');
        return Iterables::sortByPropertyAsc($unique, 'nickname');
    }
}
