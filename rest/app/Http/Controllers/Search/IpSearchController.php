<?php

namespace App\Http\Controllers;

use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IpSearchController extends Controller {

    public function getIpSearch(Request $request) {
        $nickname = $request->input('nickname');
        $ipAddress = $request->input('ipAddress');

        $items = [];
        $logTables = ['login', 'log_sitecp', 'log_staff', 'log_mod', 'log_user'];
        foreach ($logTables as $table) {
            $items = array_merge($items, DB::table($table)
                ->join('users', 'users.userId', '=', $table . '.userId')
                ->where('users.nickname', 'LIKE', Value::getFilterValue($request, $nickname))
                ->orWhere('ip', 'LIKE', Value::getFilterValue($request, $ipAddress))
                ->select($table . '.userId', $table . '.ip', $table . '.createdAt', 'users.nickname', 'users.userId')
                ->get()
                ->toArray());
        }

        return response()->json(Iterables::unique(Iterables::sortByPropertyAsc($items, 'nickname'), 'userId'));
    }
}
