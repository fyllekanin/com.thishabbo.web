<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\EloquentModels\User\UserData;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserEssentialsController extends Controller {
    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
    }

    /**
     * @param $userId
     *
     * @return JsonResponse
     */
    public function getUser($userId) {
        $user = UserHelper::getUser($userId);

        Condition::precondition(!$user, 404, 'No user with that ID');

        return response()->json($user);
    }

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function deleteAvatar(Request $request, $userId) {
        $user = $request->get('auth');
        $path = $this->mySettingRepository->getResourcePath('images/users/'.$userId.'.gif');

        Condition::precondition(!File::exists($path), 404, 'This user do not have a avatar');

        File::delete($path);

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_AVATAR, [], $userId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function deleteCoverPhoto(Request $request, $userId) {
        $user = $request->get('auth');
        $path = $this->mySettingRepository->getResourcePath('images/covers/'.$userId.'gif');

        Condition::precondition(!File::exists($path), 404, 'This user do not have a coverphoto');

        File::delete($path);

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_COVER_PHOTO, [], $userId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function deleteSignature(Request $request, $userId) {
        $user = $request->get('auth');
        $userdata = UserData::userId($userId)->first();

        Condition::precondition(!$userdata || empty($userdata->signature), 404, 'This user do not have a signature');

        $userdata->signature = '';
        $userdata->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_SIGNATURE, [], $userId);
        return response()->json();
    }
}
