<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Repositories\Repository\UserRepository;
use Illuminate\Http\Request;

class RoraController extends Controller {
    private $myUserRepository;

    public function __construct(UserRepository $userRespostory) {
        parent::__construct();
        $this->myUserRepository = $userRespostory;
    }

    public function searchUsers(Request $request) {
        $nickname = $request->input('nickname');
        return response()->json($this->myUserRepository->getUsersBySearch($nickname));
    }
}
