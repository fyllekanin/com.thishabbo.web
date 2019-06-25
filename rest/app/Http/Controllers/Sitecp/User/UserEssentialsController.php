<?php

namespace App\Http\Controllers\Sitecp\User;

use App\EloquentModels\User\UserData;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserEssentialsController extends Controller {

    /**
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser($userId) {
        $user = UserHelper::getUser($userId);

        Condition::precondition(!$user, 404, 'No user with that ID');

        return response()->json($user);
    }

    /**
     * @param Request $request
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar(Request $request, $userId) {
        $user = $request->get('auth');
        $path = base_path('/public/rest/resources/images/users/' . $userId . '.gif');

        Condition::precondition(!File::exists($path), 404, 'This user do not have a avatar');

        File::delete($path);

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_AVATAR, [], $userId);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteCoverPhoto(Request $request, $userId) {
        $user = $request->get('auth');
        $path = base_path('/public/rest/resources/images/covers/' . $userId . '.gif');

        Condition::precondition(!File::exists($path), 404, 'This user do not have a coverphoto');

        File::delete($path);

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_COVER_PHOTO, [], $userId);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSignature(Request $request, $userId) {
        $user = $request->get('auth');
        $userdata = UserData::userId($userId)->first();

        Condition::precondition(!$userdata || empty($userdata->signature), 404, 'This user do not have a signature');

        $userdata->signature = '';
        $userdata->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_SIGNATURE, [], $userId);
        return response()->json();
    }
}
