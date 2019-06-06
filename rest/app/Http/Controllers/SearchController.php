<?php

namespace App\Http\Controllers;

use App\Http\Impl\SearchControllerImpl;
use App\Logger;
use App\Models\Logger\Action;
use Illuminate\Http\Request;

class SearchController extends Controller {
    private $myImpl = null;

    public function __construct(SearchControllerImpl $searchControllerImpl) {
        parent::__construct();
        $this->myImpl = $searchControllerImpl;
    }

    /**
     * @param Request $request
     * @param $type
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSearch(Request $request, $type, $page) {
        $user = $request->get('auth');
        $result = $this->myImpl->getResult($request, $type, $page, $user);

        Logger::user($user->userId, $request->ip(), Action::SEARCHED, ['text' => $request->input('text')]);
        return response()->json([
            'total' => $result->total,
            'page' => $page,
            'items' => $result->items,
            'parameters' => [
                'type' => $type,
                'text' => $request->input('text'),
                'byUser' => $request->input('byUser'),
                'from' => $request->input('from'),
                'to' => $request->input('to'),
                'order' => $request->input('order') ? $request->input('order') : 'desc'
            ]
        ]);
    }
}
