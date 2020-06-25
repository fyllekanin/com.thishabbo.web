<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Repositories\Repository\UserRepository;
use Illuminate\Http\Request;

class JoshuaController extends Controller {
    private $myUserRepository;

    public function __construct(UserRepository $userRepository) {
        parent::__construct();
        $this->myUserRepository = $userRepository;
    }

    public function searchUsers(Request $request) {
        $nickname = $request->input('nickname');
        return response()->json($this->myUserRepository->getUserBySearch($nickname));
    }
}
