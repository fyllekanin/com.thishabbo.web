<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserProfile;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfileController extends Controller {

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile() {
        $user = Cache::get('auth');
        $profile = UserProfile::where('userId', $user->userId)->first();

        if (!$profile) {
            return response()->json();
        }
        return response()->json([
            'isPrivate' => $profile->isPrivate,
            'youtube' => $profile->youtube
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request) {
        $user = Cache::get('auth');
        $profile = UserProfile::where('userId', $user->userId)->first();
        $data = (object) $request->input('data');

        if (!$profile) {
            $profile = new UserProfile([ 'userId' => $user->userId ]);
            $profile->save();
        }

        $profile->isPrivate = Value::objectProperty($data, 'isPrivate', false);
        $profile->youtube = Value::objectProperty($data, 'youtube', null);
        $profile->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_PROFILE);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSocialNetworks () {
        $user = Cache::get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        return response()->json([
            'discord' => $userData->discord,
            'twitter' => $userData->twitter
        ]);
    }

    /**
     * @param Request $request
     */
    public function updateSocialNetworks (Request $request) {
        $user = Cache::get('auth');
        $twitter = $request->input('twitter');
        $discord = $request->input('discord');

        Condition::precondition(isset($twitter) && !preg_match('/^@?(\w){1,15}$/', $twitter),
            400, 'Twitter format is invalid');
        Condition::precondition(isset($discord) && !preg_match('/^((.+?)#\d{4})/', $discord),
            400, 'Discord format is invalid');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->discord = $discord;
        $userData->twitter = $twitter;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_SOCIAL_NETWORKS);
    }

    /**
     * Get request for getting the maximum size of avatar the
     * requested user can use.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvatarSize () {
        $user = Cache::get('auth');
        $avatarHeight = $this->getMaxAvatarHeight($user);
        $avatarWidth = $this->getMaxAvatarWidth($user);

        return response()->json([
            'width' => $avatarWidth,
            'height' => $avatarHeight
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateCover (Request $request) {
        $user = Cache::get('auth');
        $cover = $request->file('cover');

        $this->validate($request, [
            'cover' => 'required|mimes:jpg,jpeg,bmp,png,gif',
        ]);

        $fileName = $user->userId . '.gif';
        $destination = base_path('/public/rest/resources/images/covers');
        $cover->move($destination, $fileName);

        Logger::user($user->userId, $request->ip(), Action::UPDATED_COVER);
        return response()->json();
    }

    /**
     * Post method to update the avatar used by a user.
     * POST is used because PUT can not have FormData and therefor no files
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateAvatar (Request $request) {
        $user = Cache::get('auth');
        $avatar = $request->file('avatar');
        $avatarHeight = $this->getMaxAvatarHeight($user);
        $avatarWidth = $this->getMaxAvatarWidth($user);

        $this->validate($request, [
            'avatar' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=' . $avatarWidth . ',max_height=' . $avatarHeight,
        ]);

        $fileName = $user->userId . '.gif';
        $destination = base_path('/public/rest/resources/images/users');
        $avatar->move($destination, $fileName);

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->avatarUpdatedAt = time();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_AVATAR);
        return response()->json(time());
    }

    /**
     * Get request to fetch the users current signature
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSignature () {
        $user = Cache::get('auth');
        $userdata = UserData::where('userId', $user->userId)->first();

        return response()->json([
            'signature' => Value::objectProperty($userdata, 'signature', ''),
            'parsedSignature' => BBcodeUtil::bbcodeParser(Value::objectProperty($userdata, 'signature', ''))
        ]);
    }

    /**
     * Put request to update the user signature
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSignature (Request $request) {
        $user = Cache::get('auth');
        $signature = $request->input('signature');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->signature = $signature;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_SIGNATURE);
        return response()->json([
            'signature' => $signature,
            'parsedSignature' => BBcodeUtil::bbcodeParser($signature)
        ]);
    }

    /**
     * Get the maximum width the supplied user can use
     *
     * @param $user
     *
     * @return int
     */
    private function getMaxAvatarWidth ($user) {
        $width = 200;

        foreach ($user->groups as $group) {
            $width = $group->avatarWidth > $width ? $group->avatarWidth : $width;
        }
        return $width;
    }

    /**
     * Get the maximum height the supplied user can use
     *
     * @param $user
     *
     * @return int
     */
    private function getMaxAvatarHeight ($user) {
        $height = 200;

        foreach ($user->groups as $group) {
            $height = $group->avatarHeight > $height ? $group->avatarHeight : $height;
        }
        return $height;
    }
}
